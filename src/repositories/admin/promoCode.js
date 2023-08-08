import { level, logger } from '../../config/logger';
import promoCodeModel from '../../models/promoCode';
import { constants as APP_CONST } from '../../constant/application';
import chefModel from '../../models/chef';

export const createPromoCode = async (body) => {
  logger.log(level.info, `>> createPromoCode()`);
  let data = {};
  const date = new Date(body.expiry_date);
  body.expiry_date = new Date(
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  );

  if (body.expiry_date < new Date()) {
    data = {
      error: true,
      message: 'err_31',
    };
    return data;
  }

  for (let i = 0; i < body.total_no_of_codes; i++) {
    const json = JSON.parse(JSON.stringify(body));
    json.promocode_value = promoCodeGenerator();
    await promoCodeModel.add(json);
  }

  data = {
    error: false,
    message: 'succ_29',
  };
  return data;
};

const promoCodeGenerator = () => {
  var coupon = '';
  var possible = APP_CONST.PROMO_CODE_STRING;
  for (var i = 0; i < 20; i++) {
    coupon += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return coupon;
};

export const getPromoCode = async (options) => {
  logger.log(level.info, `>> getPromoCode()`);
  let [promoData, count] = await Promise.all([
    promoCodeModel.get({ status: { $ne: 3 } }, '', options),
    promoCodeModel.count({ status: { $ne: 3 } }),
  ]);
  let promolist = [];
  await Promise.all(
    promoData.map(async (promo) => {
      if (promo.status === 1 && promo.claimed_by && promo.claimed_by !== null) {
        const userData = await chefModel.get(
          { chef_id: promo.claimed_by },
          'firstname email'
        );

        if (userData && userData.length > 0) {
          promo.claimed_person = userData[0].firstname;
          promo.claimed_person_email = userData[0].email;
        }
      }

      promo.promocode_status_type = promo.status;
      if (promo.expiry_date <= new Date()) {
        await promoCodeModel.update(
          { promocode_value: promo.promocode_value },
          { $set: { status: 2 } }
        );
        promo.promocode_status_type = 'Expired';
      }

      promolist = [...promolist, promo];
      return promolist;
    })
  );

  let data = {
    message: 'succ_30',
    count,
    data: promolist,
  };
  return data;
};

export const deletePromoCode = async (promo_code_id) => {
  logger.log(level.info, `>> deletePromoCode()`);
  await promoCodeModel.delete({ promo_code_id, status: { $ne: 1 } });

  let data = {
    message: 'succ_31',
  };
  return data;
};
