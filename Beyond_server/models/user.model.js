module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define("User", {
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    kana_first: {
      type: Sequelize.STRING,
    },
    kana_last: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    _token: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    phone_number: {
      type: Sequelize.STRING
    },
    post_code: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    },
    point: {
      type: Sequelize.INTEGER,
    },
    deposit: {
      type: Sequelize.INTEGER,
    },
    role: {
      type: Sequelize.INTEGER,
    },
    invite_send_code: {
      type: Sequelize.STRING
    },
    invite_receive_code: {
      type: Sequelize.STRING
    },
    mile: {
      type: Sequelize.INTEGER
    },
    avatar: {
      type: Sequelize.STRING
    },
    resetPasswordToken: {
      type: Sequelize.STRING,
    },
    resetPasswordExpires: {
      type: Sequelize.DATE,
    },
    phone_sms: {
      type: Sequelize.STRING,
    },
    phone_verify1: {
      type: Sequelize.INTEGER,
    },
    is_exit: {
      type: Sequelize.INTEGER,
    },
    // 装飾は最初の商品登録時に行われます。
    // 登録済みの商品は装飾画像再適用または再登録を行ってください。
    // 0:有
    // 1:無
    img_init_agree: {
      type: Sequelize.INTEGER,
    },
    img_init_url: {
      type: Sequelize.STRING,
    },
    // 0:装飾画像を商品画像の縦横比に合わせて変形する
    // 1:装飾画像の縦横比に合わせて商品画像の上下または左右を切り取る
    // 2:装飾画像の縦横比に合わせて商品画像の上下または左右に余白を追加する
    img_init_config: {
      type: Sequelize.INTEGER,
    },
    //アカウント設定
    account_company_info: {
      type: Sequelize.STRING
    },
    account_au_api: {
      type: Sequelize.STRING
    },
    account_au_api_auto_update: {
      type: Sequelize.STRING
    },
    account_au_api_expiry_date: {
      type: Sequelize.STRING
    },
    account_sp_api_client_id: {
      type: Sequelize.STRING
    },
    account_sp_api_client_secret: {
      type: Sequelize.STRING
    },
    account_sp_api_application_id: {
      type: Sequelize.STRING
    },
    account_sp_api_refresh_token: {
      type: Sequelize.TEXT
    },
    //出品済み商品への適用は、商品ごとに販売状態が変化したか受注を処理した時に行われます。
    account_stock: {
      type: Sequelize.STRING
    },
    //最大画像枚数-出品済み商品へは適用されません。
    account_img_count: {
      type: Sequelize.STRING
    },
    //必須FBA出品者数-FBAの出品者数がこれ未満の商品は在庫切れとします。 出品済み商品への適用は、次回の定期更新時に行われます。
    account_fba_count: {
      type: Sequelize.STRING
    },
    //店舗名
    account_store: {
      type: Sequelize.STRING
    },
    //送信元メールアドレス
    account_mail: {
      type: Sequelize.STRING
    },
    //お問い合わせ先メールアドレス
    account_mail_contact: {
      type: Sequelize.STRING
    },
    //本文ヘッダー
    account_mail_head: {
      type: Sequelize.STRING
    },
    //本文フッター
    account_mail_txt: {
      type: Sequelize.STRING
    },
    //宅配便の配送業者の既定値
    //0:クロネコヤマト
    //1:佐川急便
    //2:福山通運
    //3:西濃運輸
    //4:日本郵便
    //5:Rakuten EXPRESS
    account_delivery: {
      type: Sequelize.INTEGER
    },
    //メール便の配送業者の既定値
    account_mail_server: {
      type: Sequelize.INTEGER
    },
    //宅配便追加上乗せ固定値
    delivery_add_fee: {
      type: Sequelize.INTEGER
    },
    //メール便追加上乗せ固定値
    mail_add_fee: {
      type: Sequelize.INTEGER
    }
  },
    {
      timestamps: false
    });
  return user;
};