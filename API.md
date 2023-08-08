### API Documentation

### Auth Flow for Admin, Chef and User

- #### Admin registration API

  - #### URL

  POST http://localhost:8000/api/admin/signup

  | Body            | Description |
  | -------------   | ---------   |
  | email           | required    |
  | password        | required    |
  | confirmPassword | required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_1"
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 400        | err_3         |
  | 400        | err_7         |
  | 400        | err_8         |
  | 400        | err_9         |
  | 400        | err_10        |
  | 500        | err_0         |

- #### Verify email using OTP API

  Here OTP is send in your register email address

  - #### URL

  POST http://localhost:8000/api/admin/verification

  | Body            | Description |
  | -------------   | ---------   |
  | email           | required    |
  | otp             | required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_0"
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 500        | err_0         |
  | 400        | err_15        |

- #### Admin login API

  - #### URL

  POST http://localhost:8000/api/admin/login

  | Body            | Description |
  | -------------   | ---------   |
  | email           | required    |
  | password        | required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "message": "succ_2",
    "data": {
    "id": 1,
    "admin_id": "Your admin id",
    "email": "your email",
    "accessToken": "your access token"
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 400        | err_7         |
  | 400        | err_8         |
  | 400        | err_11        |
  | 400        | err_12        |
  | 400        | err_13        |
  | 400        | err_14        |
  | 400        | err_15        |
  | 400        | err_16        |
  | 400        | err_17        |
  | 500        | err_0         |

- #### Admin Forgot Password API

  - #### URL

  GET http://localhost:8000/api/admin/forgot_password/email/:email

  | Parameter       | Description |
  | -------------   | ---------   |
  | email           | required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_3"
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 400        | err_7         |
  | 400        | err_11        |
  | 400        | err_14        |
  | 400        | err_15        |
  | 400        | err_16        |
  | 400        | err_17        |
  | 500        | err_0         |

- #### Admin Reset Password API

  - #### URL

  POST http://localhost:8000/api/admin/change_password

  | Body            | Description |
  | -------------   | ---------   |
  | newPassword     | required    |
  | confirmPassword | required    |
  | token           | required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_3"
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 400        | err_8         |
  | 400        | err_9         |
  | 400        | err_18        |
  | 500        | err_0         |

- #### Get My Admin Account API

  - #### URL

  GET http://localhost:8000/api/admin/me

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_6",
    "data": {
    "status": 1,
    "\_id": 1,
    "email": "your email",
    "admin_id": "your admin id",
    "country": "India",
    "firstname": "janvi",
    "lastname": "anghan",
    "phone_number": "1234567890",
    "profile_image": "your profile image",
    "id": "1"
    }
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Update My Admin Account API

  - #### URL

  PUT http://localhost:8000/api/admin/me

  | Body            | Description |
  | -------------   | ---------   |
  | firstname       | optional    |
  | lastname        | optional    |
  | phone_number    | optional    |
  | oldPassword     | optional    |
  | newPassword     | optional    |
  | profile_image   | optional    |
  | country         | optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_6",
    "data": {
    "status": 1,
    "\_id": 1,
    "email": "your email",
    "admin_id": "your admin id",
    "country": "India",
    "firstname": "janvi",
    "lastname": "anghan",
    "phone_number": "1234567890",
    "profile_image": "your profile image",
    "id": "1"
    }
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_8         |
  | 400        | err_11        |
  | 400        | err_19        |
  | 500        | err_0         |

### Admin

- #### Create Package API

  - #### URL

  POST http://localhost:8000/api/admin/package

  | Body              | Description |
  | -------------     | ---------   |
  | package_name      | required    |
  | maximum_portfolio | required    |
  | maximum_recipe    | required    |
  | maximum_coupon    | required    |
  | amount            | required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    {
    "message": "succ_21",
    "data": {
    "currency": "usd",
    "status": 1,
    "is_default": false,
    "package_name": "Advance",
    "maximum_portfolio": 25,
    "maximum_recipe": 25,
    "maximum_coupon": 25,
    "amount": 299,
    "package_id": "993d9de4-f3ce-417d-91c0-64a4d079dfb5",
    "created_at": "2021-09-30T06:06:21.219Z",
    "updated_at": "2021-09-30T06:06:21.219Z",
    "\_id": 72,
    "\_\_v": 0
    }
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_21        |
  | 400        | err_22        |
  | 400        | err_40        |
  | 400        | err_65        |
  | 400        | err_23        |
  | 400        | err_83        |
  | 500        | err_0         |

- #### Get All Packages API

  - #### URL

  GET http://localhost:8000/api/admin/package/list?page=1&limit=10

  Here page and limit is used for pagination

  | Query           | Description |
  | -------------   | ---------   |
  | page            | optional    |
  | limit           | optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "count": 15,
    "message": "succ_22",
    "data": [{}]

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Get Package Details API

  - #### URL

  GET http://localhost:8000/api/admin/package?package_id=Enter package id

  | Query           | Description |
  | -------------   | ---------   |
  | package_id      | required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "error": false,
    "message": "succ_23",
    "data": {}

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_39        |
  | 400        | err_24        |
  | 500        | err_0         |

- #### Edit Package API

  - #### URL

  PUT http://localhost:8000/api/admin/package?package_id=Enter package id

  | Body            | Description |
  | -------------   | ---------   |
  | status          | required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "error": false,
    "message": "succ_24"
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_39        |
  | 400        | err_24        |
  | 400        | err_29        |
  | 500        | err_0         |

- #### Delete Package API

  - #### URL

  DELETE http://localhost:8000/api/admin/package?package_id=Enter package id

  | Query           | Description |
  | -------------   | ---------   |
  | package_id      | required    |  

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "error": false,
    "message": "succ_25"
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_39        |
  | 400        | err_24        |
  | 500        | err_0         |

- #### Set Default Package API

  - #### URL

  PUT http://localhost:8000/api/admin/package/default?package_id=Enter package id

  | Query           | Description |
  | -------------   | ---------   |
  | package_id      | required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "error": false,
    "message": "succ_26"
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_39        |
  | 400        | err_24        |
  | 500        | err_0         |

- #### Get Chef purchased package list API

  - #### URL

  GET http://localhost:8000/api/admin/package_purchase/list?page=1&limit=5

  | Query           | Description |
  | -------------   | ---------   |
  | page            | optional    |
  | limit           | optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_41",
    "count": 2,
    "data": [{}],

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Get Chef purchased package details API

  - #### URL

  GET http://localhost:8000/api/admin/package_purchase?purchase_id=purchase_id

  | Query           | Description |
  | -------------   | ---------   |
  | purchase_id     | required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_41",
    "count": 2,
    "data": [{}],

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_41        |
  | 400        | err_42        |
  | 500        | err_0         |

- #### Create promo code API

  - #### URL

  POST http://localhost:8000/api/admin/promocode

  | Body              | Description |
  | -------------     | ---------   |
  | reference_name    | required    |
  | total_no_of_codes | required    |
  | expiry_date       | required    |
  | promo_code_name   | required    |
  | maximum_portfolio | required    |
  | maximum_recipe    | required    |
  | maximum_coupon    | required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "error": false,
    "message": "succ_29"
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_31        |
  | 400        | err_32        |
  | 400        | err_33        |
  | 400        | err_34        |
  | 400        | err_35        |
  | 400        | err_36        |
  | 400        | err_40        |
  | 400        | err_83        |
  | 500        | err_0         |

- #### Get All promo code API

  - #### URL

  GET http://localhost:8000/api/admin/promocode?page=1&limit=5

  | Query           | Description |
  | -------------   | ---------   |
  | page            | optional    |
  | limit           | optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "message": "succ_30",
    "count": 13,
    "data": [{}]

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Delete promo code API

  - #### URL

  DELETE http://localhost:8000/api/admin/promocode?promo_code_id=Enter promo code id

  | Query           | Description |
  | -------------   | ---------   |
  | promo_code_id   | required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_31"
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_38        |
  | 400        | err_39        |
  | 500        | err_0         |

- #### Get Chef promo applied list API

  - #### URL

  GET http://localhost:8000/api/admin/package_purchase/promo?page=1&limit=5

  | Query           | Description |
  | -------------   | ---------   |
  | page            | optional    |
  | limit           | optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_41",
    "count": 0,
    "data": []
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Add recipe options API

  - #### URL

  POST http://localhost:8000/api/admin/recipe_options

  | Body            | Description |
  | -------------   | ---------   |
  | option_name     | required    |
  | category        | required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_61",
    "data": {}
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_61        |
  | 400        | err_62        |
  | 500        | err_0         |

- #### Get All recipe options API

  - #### URL

  GET http://localhost:8000/api/admin/recipe_options/list?page=1&limit=5

  | Query           | Description |
  | -------------   | ---------   |
  | page            | optional    |
  | limit           | optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_65",
    "count": 12,
    "data": [{}]

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Get recipe options details API

  - #### URL

  GET http://localhost:8000/api/admin/recipe_options?recipe_option_id=Enter recipe option id

  | Query            | Description |
  | -------------    | ---------   |
  | recipe_option_id | required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_65",
    "count": 12,
    "data": [{}]

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_64        |
  | 400        | err_63        |
  | 500        | err_0         |

- #### Edit recipe options API

  - #### URL

  PUT http://localhost:8000/api/admin/recipe_options?recipe_option_id=Enter recipe option id

  | Query            | Description |
  | -------------    | ---------   |
  | recipe_option_id | required    |

  | Body            | Description |
  | -------------   | ---------   |
  | option_name     | required    |
  | category        | required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_64"
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_61        |
  | 400        | err_62        |
  | 400        | err_63        |
  | 400        | err_64        |
  | 500        | err_0         |

- #### Delete recipe options API

  - #### URL

  DELETE http://localhost:8000/api/admin/recipe_options?recipe_option_id=Enter recipe option id

  | Query            | Description |
  | -------------    | ---------   |
  | recipe_option_id | required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_63"
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_63        |
  | 400        | err_64        |
  | 500        | err_0         |

- #### Get all coupons API

  - #### URL

  GET http://localhost:8000/api/admin/coupon?page=1&limit=10

  | Query           | Description |
  | -------------   | ---------   |
  | page            | optional    |
  | limit           | optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "message": "succ_142",
    "count": 10,
    "data": [{}]

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Delete Coupon Details API

  - #### URL

  DELETE http://localhost:8000/api/admin/coupon?coupon_code=Enter coupon code

  | Query           | Description |
  | -------------   | ---------   |
  | coupon_code     | required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_143",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_146       |
  | 400        | err_147       |
  | 500        | err_0         |

- #### Get dashboard card data API

  - #### URL

  GET http://localhost:8000/api/admin/dashboard/user_data

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_181",
    "total_chefs": 7,
    "total_new_chefs": 4,
    "total_users": 2,
    "total_new_users": 2
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Get All Chef Feedbacks API

  - #### URL

  GET http://localhost:8000/api/admin/feedback/chef_feedbacks?page=1&limit=5

  | Query           | Description |
  | -------------   | ---------   |
  | page            | optional    |
  | limit           | optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_184",
    "count": 16,
    "customerFeedbacks": [{}]

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Update Feedback status API

  - #### URL

  PUT http://localhost:8000/api/admin/feedback?feedback_id=Enter feedback id

  | Query           | Description |
  | -------------   | ---------   |
  | feedback_id     | required    |

  | Body            | Description |
  | -------------   | ---------   |
  | feedback_status | required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_183"
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_184       |
  | 400        | err_185       |
  | 400        | err_186       |
  | 500        | err_0         |

- #### Get all users Feedback API

  - #### URL

  GET http://localhost:8000/api/admin/feedback/user_feedbacks?page=1&limit=5

  | Query           | Description |
  | -------------   | ---------   |
  | page            | optional    |
  | limit           | optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "message": "succ_184",
    "count": 9,
    "customerFeedbacks": [{}]

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Get all chefs contact us API

  - #### URL

  GET http://localhost:8000/api/admin/contact/chef_contact_us?page=1&limit=5

  | Query           | Description |
  | -------------   | ---------   |
  | page            | optional    |
  | limit           | optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "message": "succ_192",
    "count": 2,
    "chefContactUs": [{}]

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Get all users contact us API

  - #### URL

  GET http://localhost:8000/api/admin/contact/user_contact_us?page=1&limit=5

  | Query           | Description |
  | -------------   | ---------   |
  | page            | optional    |
  | limit           | optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "message": "succ_192",
    "count": 2,
    "userContactUs": [{}]

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Get all anonymous users contact us API

  - #### URL

  GET http://localhost:8000/api/admin/contact/user_contact_us?page=1&limit=5

  | Query           | Description |
  | -------------   | ---------   |
  | page            | optional    |
  | limit           | optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "message": "succ_192",
    "count": 2,
    "userContactUs": [{}]

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

### Chef

- #### Get All Package List API

  - #### URL

  GET http://localhost:8000/api/chef/package/list?page=1&limit=10

  | Query           | Description |
  | -------------   | ---------   |
  | page            | Optional    |
  | limit           | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_22",
    "count": 14,
    "data": [{}]

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Buy Package API

  - #### URL

  POST http://localhost:8000/api/chef/package/buy?package_id=Enter Package Id &apply_immediately=true

  | Query             | Description |
  | -------------     | ---------   |
  | package_id        | required    |
  | apply_immediately | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_27",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |       
  | 401        | Unauthorized  |
  | 400        | err_25        |
  | 400        | err_26        |
  | 400        | err_27        |
  | 400        | err_24        |
  | 400        | err_28        |
  | 400        | err_39        |
  | 500        | err_0         |

- #### Get Chef Purchase Package List API

  - #### URL

  GET http://localhost:8000/api/chef/package_purchase/list?page=1&limit=12

  | Query           | Description |
  | -------------   | ---------   |
  | page            | Optional    |
  | limit           | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_41",
    "count": 0,
    "data": []
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Get Chef Purchase Package Details API

  - #### URL

  GET http://localhost:8000/api/chef/package_purchase?purchase_id=Enter purchase id

  | Query           | Description |
  | -------------   | ---------   |
  | purchase_id     | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_41",
    "data": []
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_41        |
  | 400        | err_42        |
  | 500        | err_0         |

- #### Get Current Active Package API

  - #### URL

  GET http://localhost:8000/api/chef/package/active

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_28"
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Get Package Details API

  - #### URL

  GET http://localhost:8000/api/chef/package?package_id=Enter pacakge id

  | Query           | Description |
  | -------------   | ---------   |
  | purchase_id     | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_23",
    "data": {}
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_39        |
  | 400        | err_24        |
  | 500        | err_0         |

- #### Add Recipe API

  - #### URL

  POST http://localhost:8000/api/chef/recipe

  | Body                    | Description |
  | -------------           | ---------   |
  | recipe_name             | Required    |
  | description             | Required    |
  | ingredients             | Required    |
  | recipe_options          | Optional    |
  | nutritional_information | Optional    |
  | images                  | Required    |
  | recipe_method           | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_71",
    "data": {}
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_71        |
  | 400        | err_72        |
  | 400        | err_73        |
  | 400        | err_51        |
  | 400        | err_79        |
  | 500        | err_0         |

- #### Get Recipe Details API

  - #### URL

  GET http://localhost:8000/api/chef/recipe?recipe_id=Enter recipe id

  | Query           | Description |
  | -------------   | ---------   |
  | recipe_id       | Required    |  

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_72",
    "data": {}
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_75        |
  | 400        | err_74        |
  | 500        | err_0         |

- #### Get All Recipes API

  - #### URL

  GET http://localhost:8000/api/chef/recipe/list?page=1&limit=2&search=abc

  | Query           | Description |
  | -------------   | ---------   |
  | page            | Optional    |
  | limit           | Optional    |
  | search          | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_75",
    "count": 0,
    "data": []
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Update Recipe API

  - #### URL

  PUT http://localhost:8000/api/chef/recipe?recipe_id=Enter recipe id

  | Query           | Description |
  | -------------   | ---------   |
  | recipe_id       | Required    |

  | Body                    | Description |
  | -------------           | ---------   |
  | recipe_name             | Optional    |
  | description             | Optional    |
  | ingredients             | Optional    |
  | recipe_options          | Optional    |
  | nutritional_information | Optional    |
  | images                  | Optional    |
  | recipe_method           | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_75",
    "count": 0,
    "data": []
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_75        |
  | 400        | err_74        |
  | 500        | err_0         |

- #### Delete Recipe API

  - #### URL

  DELETE http://localhost:8000/api/chef/recipe?recipe_id=Enter recipe id

  | Query           | Description |
  | -------------   | ---------   |
  | recipe_id       | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_74",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |       
  | 401        | Unauthorized  |
  | 400        | err_75        |
  | 400        | err_74        |
  | 500        | err_0         |

- #### Update Recipe Status API

  - #### URL

  PUT http://localhost:8000/api/chef/recipe/status?recipe_id=Enter recipe id

  | Query           | Description |
  | -------------   | ---------   |
  | recipe_id       | Required    |

  | Body            | Description |
  | -------------   | ---------   |
  | status          | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_75",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_75        |
  | 400        | err_74        |
  | 400        | err_76        |
  | 500        | err_0         |  

- #### Create Portfolio API

  - #### URL

  POST http://localhost:8000/api/chef/portfolio

  | Body            | Description |
  | -------------   | ---------   |
  | portfolio_name  | Required    |
  | recipeAndTime   | Required    |
  | amount          | Required    |
  | images          | Required    |
  | description     | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_51",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_53        |
  | 400        | err_56        |
  | 500        | err_0         |

- #### Update Portfolio API

  - #### URL

  PUT http://localhost:8000/api/chef/portfolio?portfolio_id=Enter portfolio id

  | Query           | Description |
  | -------------   | ---------   |
  | portfolio_id    | Required    |

  | Body            | Description |
  | -------------   | ---------   |
  | portfolio_name  | Required    |
  | recipeAndTime   | Optional    |
  | amount          | Required    |
  | images          | Optional    |
  | description     | Required    |
  | existing_images | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_52",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_57        |
  | 400        | err_58        |
  | 500        | err_0         |

- #### Delete Portfolio API

  - #### URL

  DELETE http://localhost:8000/api/chef/portfolio?portfolio_id=Enter portfolio id

  | Query           | Description |
  | -------------   | ---------   |
  | portfolio_id    | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_53",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_57        |
  | 400        | err_58        |
  | 500        | err_0         |

- #### Update Portfolio Status API

  - #### URL

  PUT http://localhost:8000/api/chef/portfolio/status?portfolio_id=Enter portfolio id

  | Query           | Description |
  | -------------   | ---------   |
  | portfolio_id    | Required    |

  | Body            | Description |
  | -------------   | ---------   |
  | status          | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_56",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_57        |
  | 400        | err_58        |
  | 400        | err_81        |
  | 500        | err_0         |

- #### Duplicate Portfolio Status API

  - #### URL

  POST http://localhost:8000/api/chef/portfolio/duplicate?portfolio_id=Enter portfolio id

  | Query           | Description |
  | -------------   | ---------   |
  | portfolio_id    | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_56",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_57        |
  | 400        | err_58        |
  | 400        | err_51        |
  | 400        | err_52        |
  | 500        | err_0         |

- #### Get Portfolio Details API

  - #### URL

  GET http://localhost:8000/api/chef/portfolio?portfolio_id=Enter portfolio id

  | Query           | Description |
  | -------------   | ---------   |
  | portfolio_id    | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_54",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_57        |
  | 400        | err_58        |
  | 500        | err_0         |

- #### Get All Portfolio List API

  - #### URL

  GET http://localhost:8000/api/chef/portfolio/list?limit=10&search=pani&page=2

  | Query           | Description |
  | -------------   | ---------   |
  | limit           | Optional    |
  | search          | Optional    |
  | page            | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_57",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |       
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Get Active Recipe List API

  - #### URL

  GET http://localhost:8000/api/chef/portfolio/active_recipe?page=1&limit=10

  | Query           | Description |
  | -------------   | ---------   |
  | limit           | Optional    |
  | page            | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_75",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Get All Recipe Options List API

  - #### URL

  GET http://localhost:8000/api/chef/recipe_options/list?page=1&limit=1

  | Query           | Description |
  | -------------   | ---------   |
  | limit           | Optional    |
  | page            | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_65",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Get Recipe Options Details API

  - #### URL

  GET http://localhost:8000/api/chef/recipe_options?recipe_option_id=Enter recipe option id

  | Query            | Description |
  | -------------    | ---------   |
  | recipe_option_id | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_62",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_63        |
  | 400        | err_64        |
  | 500        | err_0         |

- #### Add Working Days API

  - #### URL

  POST http://localhost:8000/api/chef/time_slot

  | Body            | Description |
  | -------------   | ---------   |
  | working_days    | Required    |
  | unavailable_on  | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_91",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_91        |
  | 500        | err_0         |

- #### Get Working Day Data API

  - #### URL

  GET http://localhost:8000/api/chef/time_slot

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_92",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |  

- #### Update Working Day Data API

  - #### URL

  PUT http://localhost:8000/api/chef/time_slot?time_slot_id=Enter time slot id

  | Query           | Description |
  | -------------   | ---------   |
  | time_slot_id    | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_93",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_92        |
  | 500        | err_0         |

- #### Delete Working Day Data API

  - #### URL

  DELETE http://localhost:8000/api/chef/time_slot?time_slot_id=Enter time slot id

  | Query           | Description |
  | -------------   | ---------   |
  | time_slot_id    | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_94",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_93        |
  | 500        | err_0         |

- #### Get Booked Date List API

  - #### URL

  GET http://localhost:8000/api/chef/time_slot/booked

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_154",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Get Invoice List API

  - #### URL

  GET http://localhost:8000/api/chef/invoice/list

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_102",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |       
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Get Invoice List API

  - #### URL

  GET http://localhost:8000/api/chef/invoice?invoice_id=Enter invoice id

  | Query           | Description |
  | -------------   | ---------   |
  | invoice_id      | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_101",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |       
  | 401        | Unauthorized  |
  | 400        | err_101       |
  | 400        | err_102       |
  | 500        | err_0         |

- #### Create Coupon API

  - #### URL

  POST http://localhost:8000/api/chef/coupon

  | Body            | Description |
  | -------------   | ---------   |
  | name            | Required    |
  | max_redemptions | Required    |
  | amount_off      | Required    |
  | expired_at      | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_141",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_142       |
  | 400        | err_143       |
  | 400        | err_144       |
  | 400        | err_145       |
  | 500        | err_0         |

- #### Get All Coupon List API

  - #### URL

  GET http://localhost:8000/api/chef/coupon/list

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_145",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |  

- #### Get Coupon Details API

  - #### URL

  GET http://localhost:8000/api/chef/coupon?coupon_code=Enter coupon code

  | Query           | Description |
  | -------------   | ---------   |
  | coupon_code     | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_142",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_146       |
  | 400        | err_147       |
  | 500        | err_0         |

- #### Update Coupon Status API

  - #### URL

  PUT http://localhost:8000/api/chef/coupon?coupon_id=Enter coupon id

  | Query           | Description |
  | -------------   | ---------   |
  | coupon_id       | Required    |

  | Body            | Description |
  | -------------   | ---------   |
  | status          | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_144",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_149       |
  | 400        | err_148       |
  | 400        | err_147       |
  | 400        | err_141       |
  | 500        | err_0         |

- #### Delete Coupon API

  - #### URL

  DELETE http://localhost:8000/api/chef/coupon?coupon_id=Enter coupon id

  | Query           | Description |
  | -------------   | ---------   |
  | coupon_id       | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_143",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_146       |
  | 400        | err_147       |
  | 500        | err_0         |

- #### Get Order List API

  - #### URL

  GET http://localhost:8000/api/chef/order?page=1&limit=2

  | Query           | Description |
  | -------------   | ---------   |
  | page            | Optional    |
  | limit           | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_152",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Edit Order Status API

  - #### URL

  PUT http://localhost:8000/api/chef/order?order_number=Enter order number

  | Query           | Description |
  | -------------   | ---------   |
  | order_number    | Required    |

  | Body            | Description |
  | -------------   | ---------   |
  | status          | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_157",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_158       |
  | 400        | err_157       |
  | 500        | err_0         |

- #### Order Details API

  - #### URL

  GET http://localhost:8000/api/chef/order/details?order_number=Enter order number

  | Query           | Description |
  | -------------   | ---------   |
  | order_number    | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_156",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_154       |
  | 400        | err_157       |
  | 500        | err_0         |

- #### Get Refund List API

  - #### URL

  GET http://localhost:8000/api/chef/order/refund?page=1&limit=2

  | Query           | Description |
  | -------------   | ---------   |
  | page            | Optional    |
  | limit           | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_154",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Get Refund Details API

  - #### URL

  GET http://localhost:8000/api/chef/order/refund/details?refund_id=Enter refund id

  | Query           | Description |
  | -------------   | ---------   |
  | refund_id       | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_154",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_155       |
  | 400        | err_156       |
  | 500        | err_0         |

- #### Connect Stripe Account API

  - #### URL

  GET http://localhost:8000/api/chef/stripe/connect

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_81",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Get Stripe Dashboard API

  - #### URL

  GET http://localhost:8000/api/chef/stripe/dashboard

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_82",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Publish Chef Profile API

  - #### URL

  PUT http://localhost:8000/api/chef/publish_profile

  | Query           | Description |
  | -------------   | ---------   |
  | refund_id       | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_8",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_81        |
  | 400        | err_94        |
  | 500        | err_0         |

- #### Applied Promo API

  - #### URL

  POST http://localhost:8000/api/chef/promo/apply?apply_immediately=true

  | Query             | Description |
  | -------------     | ---------   |
  | apply_immediately | Optional    |

  | Body            | Description |
  | -------------   | ---------   |
  | promocode_value | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_43",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_46        |
  | 400        | err_43        |
  | 400        | err_44        |
  | 400        | err_45        |
  | 400        | err_48        |
  | 400        | err_50        |
  | 500        | err_0         |

- #### Add feedback chef to admin API

  - #### URL

  POST http://localhost:8000/api/chef/feedback/add

  | Body            | Description |
  | -------------   | ---------   |
  | feedback_type   | Required    |
  | title           | Required    |
  | description     | Required    |
  | image           | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_182",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_181       |
  | 400        | err_182       |
  | 400        | err_183       |
  | 500        | err_0         |

- #### Update feedback status API

  - #### URL

  PUT http://localhost:8000/api/chef/feedback?feedback_id=Enter feedback id

  | Query           | Description |
  | -------------   | ---------   |
  | feedback_id     | Required    |

  | Body            | Description |
  | -------------   | ---------   |
  | feedback_status | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_183",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_184       |
  | 400        | err_186       |
  | 400        | err_185       |
  | 500        | err_0         |

- #### Get all users feedback API

  - #### URL

  GET http://localhost:8000/api/chef/feedback?page=1&limit=5

  | Query           | Description |
  | -------------   | ---------   |
  | page            | Optional    |
  | limit           | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_184",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Add Contact Us API

  - #### URL

  POST http://localhost:8000/api/chef/contact_us

  | Body            | Description |
  | -------------   | ---------   |
  | fullName        | Required    |
  | email           | Required    |
  | message         | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_191",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_191       |
  | 400        | err_192       |
  | 400        | err_193       |
  | 500        | err_0         |

- #### Get All Contact Us API

  - #### URL

  GET http://localhost:8000/api/chef/contact_us?page=1&limit=10

  | Query           | Description |
  | -------------   | ---------   |
  | page            | Optional    |
  | limit           | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_192",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Get All Ratings API

  - #### URL

  GET http://localhost:8000/api/chef/ratings?page=1&limit=10&rating_to=RECIPE

  | Query           | Description |
  | -------------   | ---------   |
  | page            | Optional    |
  | limit           | Optional    |
  | rating_to       | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_172",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Get Dashboard Data API

  - #### URL

  GET http://localhost:8000/api/chef/dashboard/user_data

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_172",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

### Chef

- #### Get All Portfolio API

  - #### URL

  GET http://localhost:8000/api/user/portfolio/list?page=1&limit=2&search=best

  | Query           | Description |
  | -------------   | ---------   |
  | page            | Optional    |
  | limit           | Optional    |
  | search          | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_57",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 500        | err_0         |

- #### Get Chef Portfolio List API

  - #### URL

  GET http://localhost:8000/api/user/portfolio/chef?chef_id=chef_id&page=1&limit=10

  | Query           | Description |
  | -------------   | ---------   |
  | page            | Optional    |
  | limit           | Optional    |
  | chef_id         | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_57",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |       
  | 500        | err_0         |
  | 400        | err_59        |
  | 400        | err_60        |

- #### Get Portfolio Details API

  - #### URL

  GET http://localhost:8000/api/user/portfolio?portfolio_id=portfolio_id

  | Query           | Description |
  | -------------   | ---------   |
  | page            | Optional    |
  | limit           | Optional    |
  | portfolio_id    | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_57",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 500        | err_0         |
  | 400        | err_57        |
  | 400        | err_58        |

- #### Add Rating And Review to Portfolio API

  - #### URL

  POST http://localhost:8000/api/user/portfolio/rating?portfolio_id=portfolio_id

  | Query           | Description |
  | -------------   | ---------   |
  | portfolio_id    | Required    |

  | Body            | Description |
  | -------------   | ---------   |
  | portfolio_id    | Required    |
  | title           | Required    |
  | review          | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_171",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |
  | 400        | err_57        |
  | 400        | err_58        |
  | 400        | err_172       |
  | 400        | err_173       |
  | 400        | err_174       |
  | 400        | err_175       |

- #### Get Portfolio rating using portfolio id API

  - #### URL

  GET http://localhost:8000/api/user/portfolio/rating?portfolio_id=portfolio_id&page=1&limit=10

  | Query           | Description |
  | -------------   | ---------   |
  | portfolio_id    | Required    |
  | page            | Optional    |
  | limit           | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_172",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 500        | err_0         |
  | 400        | err_57        |
  | 400        | err_58        |
  | 400        | err_175       |

- #### Get Top Portfolio List API

  - #### URL

  GET http://localhost:8000/api/user/portfolio/top?top=5

  | Query           | Description |
  | -------------   | ---------   |
  | top             | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_174",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 500        | err_0         |

- #### Get All Chef Recipe List API

  - #### URL

  GET http://localhost:8000/api/user/recipe/chef?chef_id=chef_id&page=1&limit=10

  | Query           | Description |
  | -------------   | ---------   |
  | chef_id         | Required    |
  | page            | Optional    |
  | limit           | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_75",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 500        | err_0         |
  | 400        | err_59        |
  | 400        | err_60        |

- #### Get All Chef Recipe List API

  - #### URL

  GET http://localhost:8000/api/user/recipe/list?page=1&limit=10

  | Query           | Description |
  | -------------   | ---------   |
  | page            | Optional    |
  | limit           | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_75",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 500        | err_0         |

- #### Get Recipe Details API

  - #### URL

  GET http://localhost:8000/api/user/recipe?recipe_id=recipe_id

  | Query           | Description |
  | -------------   | ---------   |
  | recipe_id       | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_72",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 500        | err_0         |
  | 400        | err_74        |

- #### Add Rating And Review to Recipe API

  - #### URL

  POST http://localhost:8000/api/user/recipe/rating?recipe_id=recipe_id

  | Query           | Description |
  | -------------   | ---------   |
  | recipe_id       | Required    |

  | Body            | Description |
  | -------------   | ---------   |
  | portfolio_id    | Required    |
  | title           | Required    |
  | review          | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_171",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |
  | 400        | err_75        |
  | 400        | err_74        |
  | 400        | err_172       |
  | 400        | err_173       |
  | 400        | err_174       |
  | 400        | err_175       |

- #### Get all recipe ratings API

  - #### URL

  GET http://localhost:8000/api/user/recipe/rating?recipe_id=recipe_idf&page=1&limit=10

  | Query           | Description |
  | -------------   | ---------   |
  | recipe_id       | Required    |
  | page            | Optional    |
  | limit           | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_172",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 500        | err_0         |
  | 400        | err_75        |
  | 400        | err_74        |

- #### Get Top Recipe List API

  - #### URL

  GET http://localhost:8000/api/user/recipe/top?top=5

  | Query           | Description |
  | -------------   | ---------   |
  | top             | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_173",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 500        | err_0         |

- #### Get Portfolio chef unavailable dates API

  - #### URL

  GET http://localhost:8000/api/user/portfolio/get_date?chef_id=chef_id

  | Query           | Description |
  | -------------   | ---------   |
  | chef_id         | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_92",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 500        | err_0         |

- #### Add to cart API

  - #### URL

  POST http://localhost:8000/api/user/cart

  | Body            | Description |
  | -------------   | ---------   |
  | portfolio_id    | Required    |
  | people          | Required    |
  | date            | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_92",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |       
  | 401        | Unauthorized  |
  | 400        | err_57        |
  | 400        | err_58        |
  | 400        | err_117       |
  | 400        | err_111       |
  | 400        | err_115       |
  | 400        | err_118       |
  | 400        | err_122       |
  | 400        | err_113       |
  | 400        | err_82        |
  | 400        | err_114       |
  | 500        | err_0         |

- #### Get My cart API

  - #### URL

  GET http://localhost:8000/api/user/cart

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_112",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Remove Cart API

  - #### URL

  DELETE http://localhost:8000/api/user/cart

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_115",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |       
  | 401        | Unauthorized  |
  | 400        | err_57        |
  | 400        | err_58        |
  | 400        | err_119       |
  | 500        | err_0         |

- #### Edit Cart API

  - #### URL

  PUT http://localhost:8000/api/user/cart?portfolio_id=portfolio_id

  | Query           | Description |
  | -------------   | ---------   |
  | portfolio_id    | Required    |

  | Body            | Description |
  | -------------   | ---------   |
  | people          | Required    |
  | date            | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_115",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_57        |
  | 400        | err_58        |
  | 400        | err_116       |
  | 400        | err_117       |
  | 500        | err_0         |

- #### Remove Single Portfolio API

  - #### URL

  DELETE http://localhost:8000/api/user/cart/remove?port_id=portfolio_id

  | Query           | Description |
  | -------------   | ---------   |
  | port_id         | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_115",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_57        |
  | 400        | err_119       |
  | 500        | err_0         |

- #### Check Cart Status API

  - #### URL

  GET http://localhost:8000/api/user/cart/status

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_116",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Apply Coupon API

  - #### URL

  PUT http://localhost:8000/api/user/cart/apply_coupon

  | Body            | Description |
  | -------------   | ---------   |
  | coupon_code     | Required    |  

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_117",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_57        |
  | 400        | err_119       |
  | 400        | err_120       |
  | 400        | err_146       |
  | 400        | err_147       |
  | 500        | err_0         |

- #### Get All Chef API

  - #### URL

  GET http://localhost:8000/api/user/chef?page=1&limit=10&search=abc

  | Query           | Description |
  | -------------   | ---------   |
  | page            | Optional    |
  | limit           | Optional    |
  | search          | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_131",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 500        | err_0         |

- #### Get Chef Details API

  - #### URL

  GET http://localhost:8000/api/user/chef/details?chef_id=chef_id

  | Query           | Description |
  | -------------   | ---------   |
  | chef_id         | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_132",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_59        |
  | 400        | err_60        |
  | 500        | err_0         |

- #### Add Rating And Review to Recipe API

  - #### URL

  POST http://localhost:8000/api/user/chef/rating?chef_id=chef_id

  | Query           | Description |
  | -------------   | ---------   |
  | chef_id         | Required    |

  | Body            | Description |
  | -------------   | ---------   |
  | portfolio_id    | Required    |
  | title           | Required    |
  | review          | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_171",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |
  | 400        | err_75        |
  | 400        | err_74        |
  | 400        | err_172       |
  | 400        | err_173       |
  | 400        | err_174       |
  | 400        | err_175       |

- #### Get Chefs all ratings API

  - #### URL

  POST http://localhost:8000/api/user/chef/rating?chef_id=chef_id&page=1&limit=10

  | Query           | Description |
  | -------------   | ---------   |
  | chef_id         | Required    |
  | page            | Optional    |
  | limit           | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_172",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |       
  | 500        | err_0         |
  | 400        | err_59        |
  | 400        | err_60        |

- #### Get top chef list API

  - #### URL

  POST http://localhost:8000/api/user/chef/top?top=5

  | Query           | Description |
  | -------------   | ---------   |
  | top             | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_173",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 500        | err_0         |

- #### Checkout session API

  - #### URL

  POST http://localhost:8000/api/user/order/checkout-session

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_151",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Get All Order List API

  - #### URL

  GET http://localhost:8000/api/user/order?page=1&limit=2

  | Query           | Description |
  | -------------   | ---------   |
  | page            | Optional    |
  | limit           | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_152",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Get Order Details API

  - #### URL

  GET http://localhost:8000/api/user/order/details?order_number=order_number

  | Query           | Description |
  | -------------   | ---------   |
  | order_number    | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_156",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Order Cancel API

  - #### URL

  POST http://localhost:8000/api/user/order/cancel?order_number=order_number

  | Query           | Description |
  | -------------   | ---------   |
  | order_number    | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_153",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_152       |
  | 400        | err_151       |
  | 400        | err_153       |
  | 500        | err_0         |

- #### Create Refund API

  - #### URL

  POST http://localhost:8000/api/user/order/cancel?order_number=order_number

  | Query           | Description |
  | -------------   | ---------   |
  | order_number    | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_153",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_152       |
  | 400        | err_151       |
  | 400        | err_153       |
  | 500        | err_0         |

- #### Get All Refund List API

  - #### URL

  GET http://localhost:8000/api/user/order/refund?page=1&limit=10

  | Query           | Description |
  | -------------   | ---------   |
  | page            | Optional    |
  | limit           | Optional    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_154",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |

- #### Get Refund Details API

  - #### URL

  GET http://localhost:8000/api/user/order/refund/details?refund_id=refund_id

  | Query           | Description |
  | -------------   | ---------   |
  | refund_id       | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_155",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_155       |
  | 400        | err_156       |
  | 500        | err_0         |

- #### Add Feedback API

  - #### URL

  POST http://localhost:8000/api/user/feedback/add

  | Body            | Description |
  | -------------   | ---------   |
  | feedback_type   | Required    |
  | title           | Required    |
  | description     | Required    |
  | image           | Required    |
  | chef_id         | Required    |
  | toAdmin         | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_155",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 400        | err_182       |
  | 400        | err_183       |
  | 500        | err_0         |

- #### Add Contact Us API

  - #### URL

  POST http://localhost:8000/api/user/contact_us?chef_id=chef_id

  | Body            | Description |
  | -------------   | ---------   |
  | fullName        | Required    |
  | email           | Required    |
  | message         | Required    |

  - #### Success Response

  - code: 200 OK
  - Content:
    "data": {
    "message": "succ_191",
    }

  - #### Error Response

  | Error Code | Error Message |
  | ---------- | ---------     |
  | 401        | Unauthorized  |
  | 500        | err_0         |
