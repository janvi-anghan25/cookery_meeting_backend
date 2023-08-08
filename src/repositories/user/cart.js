import { level, logger } from '../../config/logger';
import { getChefUnavailableDates } from '../user/portfolio';
import portfolioModel from '../../models/portfolio';
import cartModel from '../../models/cart';
import moment from 'moment';
import couponModel from '../../models/coupon';
import orderModel from '../../models/order';
// import { checkActionEligibility } from '../chef/chef';

export const addToCart = async (user_id, body, startNewCart) => {
  logger.log(level.info, `>> addToCart()`);
  let filter = {
    portfolio_id: body.portfolio_id,
    status: 1,
    amount: { $elemMatch: { people: Number(body.people) } },
  };

  let portfolioData = await portfolioModel.get(filter);

  // ? Error Check Function
  let errorExist = await checkError(portfolioData, body, user_id, startNewCart);
  if (errorExist.error) {
    return errorExist;
  }
  portfolioData = portfolioData[0];

  // ? Add To Cart Function
  let addedData = await addPortfolioToCart(portfolioData, body, user_id);
  let data = {
    error: false,
    message: 'succ_111',
    data: addedData,
  };
  return data;
};

const addPortfolioToCart = async (portfolioData, body, user_id) => {
  logger.log(level.info, `>> addPortfolioToCart()`);

  let existCartData = await cartModel.get({ user_id, status: 1 });

  // ? If Cart Exist then push in existing portfolio array
  if (existCartData && existCartData.length > 0) {
    existCartData = existCartData[0];

    let amount_spend = portfolioAmount(portfolioData, body);

    let [portfolios] = orderPortfolioArr(body, amount_spend);

    existCartData.ordersPortfolio.portfolios.push(portfolios);

    let cartJSONData = finalCartData(
      portfolioData,
      existCartData.ordersPortfolio.portfolios,
      user_id
    );
    await cartModel.update({ user_id }, { $set: cartJSONData });
    return existCartData;
  }

  // ? Add New cart
  let cartJSONData = await addPortfolio(portfolioData, body, user_id);
  await cartModel.add(cartJSONData);
  return cartJSONData;
};

const addPortfolio = async (portfolioData, body, user_id) => {
  logger.log(level.info, `>> addPortfolio()`);

  // ? Get Amount of selected people price
  let amount_spend = portfolioAmount(portfolioData, body);

  // ? Create Array of chef portfolio
  let portfolios = orderPortfolioArr(body, amount_spend);

  // ? Create final Cart JSON
  let cartJSONData = finalCartData(portfolioData, portfolios, user_id);

  return cartJSONData;
};

const portfolioAmount = (portfolioData, body) => {
  logger.log(level.info, `>> portfolioAmount()`);
  let amount_spend;
  portfolioData.amount.filter((pricing) => {
    if (pricing.people === body.people) {
      amount_spend = pricing.price;
      return amount_spend;
    }
  });
  return amount_spend;
};

const orderPortfolioArr = (body, amount_spend) => {
  logger.log(level.info, `>> orderPortfolioArr()`);

  let portfolioDataArr = [];
  portfolioDataArr = [
    {
      portfolio_id: body.portfolio_id,
      date: body.date,
      people: body.people,
      amount_spend,
    },
  ];
  return portfolioDataArr;
};

const finalCartData = (portfolioData, portfolios, user_id) => {
  logger.log(level.info, `>> finalCartData()`);
  // ? Order Portfolio
  let ordersPortfolioJSON = {};
  ordersPortfolioJSON = {
    chef_id: portfolioData.chef_id,
    portfolios,
  };

  // ? Final Cart Data
  let cartJSONData = {};
  cartJSONData.user_id = user_id;
  cartJSONData.ordersPortfolio = ordersPortfolioJSON;
  return cartJSONData;
};

const checkError = async (portfolioData, body, user_id, startNewCart) => {
  logger.log(level.info, `>> checkError()`);

  let data = {};

  // ? If Portfolio data not available for given data
  if (!portfolioData || portfolioData.length <= 0) {
    data = {
      error: true,
      message: 'err_111',
    };
    return data;
  }

  // ? Check if chef is connected successfully with stripe market place
  // let stripe_response = await checkActionEligibility(portfolioData[0].chef_id);
  // if (!stripe_response) {
  //   data = {
  //     error: true,
  //     message: 'err_112',
  //   };
  //   return data;
  // }

  // ? Check Valid dates
  let checkDateError = await checkValidDate(portfolioData, body, user_id);
  if (checkDateError.error) {
    return checkDateError;
  }

  // ? Check if chef is same or not
  let existCartData = await cartModel.get({ user_id, status: 1 });
  if (existCartData && existCartData.length > 0) {
    if (startNewCart) {
      await cartModel.delete({ user_id });
      data = {
        error: false,
      };
      return data;
    }

    existCartData = existCartData[0];

    if (existCartData.ordersPortfolio.chef_id !== portfolioData[0].chef_id) {
      data = {
        error: true,
        message: 'err_115',
      };
      return data;
    }

    let [filterSamePortfolio] = await Promise.all(
      existCartData.ordersPortfolio.portfolios.map((cart) => {
        if (cart.portfolio_id === body.portfolio_id) {
          data = {
            error: true,
            message: 'err_118',
          };
          return data;
        }
        data = { error: false };
        return data;
      })
    );
    return filterSamePortfolio;
  }
  data = {
    error: false,
  };
  return data;
};

export const checkValidDate = async (portfolioData, body, user_id) => {
  logger.log(level.info, `>> checkValidDate()`);

  let chefUnAvailableDates = await getChefUnavailableDates({
    portfolio_id: portfolioData[0].portfolio_id,
  });

  let data = {};

  let unavailableWeekDays = chefUnAvailableDates.data.weekDays;
  let unavailableDates = chefUnAvailableDates.data.dates;

  let day = moment(body.date).format('dddd').toLowerCase();
  let todayDate = moment(new Date()).format('YYYY-MM-DD');

  // ? Check if on give dates day chef available or not
  let isDayInclude = unavailableWeekDays.includes(day);

  // ? Check if on give date chef available or not
  let isDateInclude = unavailableDates.includes(body.date);

  // ? Check if today date is >= given date or not
  let greaterThanTodayDate = todayDate >= body.date;

  // ? Check if Cart's Portfolio Date Already selected
  let isDateIncludeCart = await dateSelectedInCart(
    portfolioData,
    body,
    user_id
  );

  //  ? On selected date check if user have already booked meetings
  let isDateBookedByUser = await usersBookedDate(body, user_id);

  if (isDateBookedByUser) {
    data = {
      error: true,
      message: 'err_122',
    };
    return data;
  }

  if (isDateIncludeCart) {
    return isDateIncludeCart;
  }

  if (greaterThanTodayDate || isDateInclude || !isDayInclude) {
    data = {
      error: true,
      message: 'err_113',
    };
    return data;
  }
  data = {
    error: false,
  };

  return data;
};

const dateSelectedInCart = async (portfolioData, body, user_id) => {
  logger.log(level.info, `>> dateSelectedInCart()`);

  portfolioData = portfolioData[0];
  let existCartData = await cartModel.get({
    user_id,
    status: 1,
    'ordersPortfolio.chef_id': portfolioData.chef_id,
  });
  let cartDates = [];
  let data;
  if (existCartData && existCartData.length > 0) {
    existCartData = existCartData[0];
    existCartData.ordersPortfolio.portfolios.map((cart) => {
      // ? Below condition is used for edit Cart
      if (cart.portfolio_id !== portfolioData.portfolio_id) {
        cartDates = [...cartDates, cart.date];
      }
      return cartDates;
    });

    if (cartDates.includes(body.date)) {
      data = {
        error: true,
        message: 'err_114',
      };
      return data;
    }
  }
};

const usersBookedDate = async (body, user_id) => {
  let userOrderDates = await orderModel.get(
    { user_id, $or: [{ status: 1 }, { status: 2 }, { status: 3 }] },
    { portfolios: { $elemMatch: { date: body.date } }, _id: 0 }
  );
  let bookedOnADate = false;
  userOrderDates.map((booked) => {
    if (booked.portfolios.length > 0) {
      bookedOnADate = true;
      return bookedOnADate;
    }
    return bookedOnADate;
  });
  return bookedOnADate;
};

export const myCart = async (user_id) => {
  logger.log(level.info, `>> myCart()`);
  let data = {};
  let cartData = await cartModel.get({ user_id, status: 1 });

  if (cartData && cartData.length > 0) {
    cartData = cartData[0];

    let portfoliosArr = [];
    let [portfolioPromiseData] = await Promise.all(
      cartData.ordersPortfolio.portfolios.map(async (portfolioData) => {
        let portfolioJsonData = await portfolioDetails(portfolioData);
        portfolioJsonData.port_id = portfolioData.port_id;
        portfoliosArr.push(portfolioJsonData);
        return portfoliosArr;
      })
    );

    let cartJSONData = {};
    let ordersPortfolio = {};
    ordersPortfolio.chef_id = cartData.ordersPortfolio.chef_id;
    ordersPortfolio.portfolios = portfolioPromiseData;

    cartJSONData.cart_id = cartData.cart_id;
    cartJSONData.user_id = cartData.user_id;
    cartJSONData.ordersPortfolio = ordersPortfolio;
    data = {
      message: 'succ_112',
      count: portfolioPromiseData.length,
      data: cartJSONData,
    };
    return data;
  }

  data = {
    message: 'succ_112',
    count: 0,
    data: [],
  };
  return data;
};

const portfolioDetails = async (portfolioData) => {
  logger.log(level.info, `>> portfolioDetails()`);
  let portfolioJson = {};
  let [portfolioDoc] = await portfolioModel.get(
    { portfolio_id: portfolioData.portfolio_id },
    {
      _id: 0,
      portfolio_id: 1,
      portfolio_name: 1,
      images: 1,
      amount: { $elemMatch: { people: portfolioData.people } },
    }
  );
  portfolioJson = {
    date: portfolioData.date,
    images: portfolioDoc.images,
    portfolio_name: portfolioDoc.portfolio_name,
    portfolio_id: portfolioDoc.portfolio_id,
    amount: portfolioDoc.amount[0].price,
    people: portfolioDoc.amount[0].people,
  };
  return portfolioJson;
};

export const removeCart = async (user_id) => {
  logger.log(level.info, `>> removeCart()`);

  await cartModel.deleteMultiple({ user_id });

  let data = {
    message: 'succ_113',
  };
  return data;
};

export const editCart = async (user_id, body, portfolio_id) => {
  logger.log(level.info, `>> editCart()`);
  let filters = findDataFilters(user_id, portfolio_id, body);
  let data = {};

  let [existCartData, portfolioData] = await Promise.all([
    cartModel.get(filters.cartFilter),
    portfolioModel.get(filters.portfolioFilter),
  ]);

  // ? Error checking function
  let errorCheck = errCheckEditCart(existCartData, portfolioData);
  if (errorCheck.error) return errorCheck;

  let isDateValidate = await checkValidDate(portfolioData, body, user_id);

  // ? Check if date is valid or not
  if (isDateValidate.error) {
    return isDateValidate;
  }

  let editedCartData = await cartModel.update(filters.cartFilter, {
    $set: filters.updateCart,
  });
  data = {
    error: false,
    message: 'succ_114',
    data: editedCartData,
  };
  return data;
};

const findDataFilters = (user_id, portfolio_id, body) => {
  logger.log(level.info, `>> findDataFilters()`);
  let portfolioFilter = {
    portfolio_id,
    status: 1,
    amount: { $elemMatch: { people: Number(body.people) } },
  };

  let cartFilter = {
    user_id,
    'ordersPortfolio.portfolios': { $elemMatch: { portfolio_id } },
  };

  let updateCart = {
    'ordersPortfolio.portfolios.$.date': body.date,
    'ordersPortfolio.portfolios.$.people': body.people,
  };

  return { portfolioFilter, cartFilter, updateCart };
};

const errCheckEditCart = (existCartData, portfolioData) => {
  logger.log(level.info, `>> errCheckEditCart()`);

  let data = {};
  if (!existCartData || existCartData.length <= 0) {
    data = {
      error: true,
      message: 'err_111',
    };
    return data;
  }
  if (!portfolioData || portfolioData.length <= 0) {
    data = {
      error: true,
      message: 'err_111',
    };
    return data;
  }
  data = {
    error: false,
  };
  return data;
};

export const removeSinglePortfolio = async (user_id, portfolio_id) => {
  logger.log(level.info, `>> removeSinglePortfolio()`);
  let cartFilter = {
    user_id,
    'ordersPortfolio.portfolios': { $elemMatch: { port_id: portfolio_id } },
  };

  let data = {};
  let cartData = await cartModel.get(cartFilter);

  if (cartData && cartData.length > 0) {
    cartData = cartData[0];
    if (cartData.ordersPortfolio.portfolios.length > 1) {
      await cartModel.update(cartFilter, {
        $pull: { 'ordersPortfolio.portfolios': { port_id: portfolio_id } },
      });
      data = {
        error: false,
        message: 'succ_115',
      };
      return data;
    }

    await cartModel.delete({ user_id });
    data = {
      error: false,
      message: 'succ_113',
    };
    return data;
  }

  data = {
    error: true,
    message: 'err_119',
  };
  return data;
};

export const checkCartStatus = async (user_id) => {
  logger.log(level.info, `>> checkCartStatus()`);
  let cartData = await cartModel.get({ user_id });
  let data = {};
  if (cartData && cartData.length > 0) {
    data = {
      message: 'succ_116',
      data: true,
    };
    return data;
  }
  data = {
    message: 'succ_116',
    data: false,
  };
  return data;
};

export const applyCoupon = async (user_id, coupon_code) => {
  logger.log(level.info, `>> applyCoupon()`);
  let [cartData, [couponData]] = await Promise.all([
    cartModel.get({ user_id, status: 1 }),
    couponModel.get({ status: 1, coupon_code }),
  ]);
  let data = {};
  let errorCheckFunc = applyCouponErr(cartData, couponData);

  if (errorCheckFunc.error) return errorCheckFunc;

  await cartModel.update({ user_id, status: 1 }, { $set: { coupon_code } });
  data = {
    error: false,
    message: 'succ_117',
  };
  return data;
};

const applyCouponErr = (cartData, couponData) => {
  let data;
  if (!cartData && cartData.length <= 0) {
    data = {
      error: true,
      message: 'err_119',
    };
    return data;
  }
  cartData = cartData[0];
  if (couponData.chef_id !== cartData.ordersPortfolio.chef_id) {
    data = {
      error: true,
      message: 'err_120',
    };
    return data;
  }
  data = {
    error: false,
  };
  return data;
};
