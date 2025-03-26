const axios = require('axios');

let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://sellingpartnerapi-fe.amazon.com/catalog/2022-04-01/items/B0DR5D4NGT?marketplaceIds=A1VC38T7YXB528',
    headers: {
        'x-amz-access-token': 'YOUR_ACCESS_TOKEN',
        'x-amz-date': '20250322T175602Z',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
    }
};

axios.request(config)
    .then((response) => {
        console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
        console.log(error);
    });

// {
//   "asin": "B0DR5D4NGT",
//   "summaries": [
//     {
//       "marketplaceId": "A1VC38T7YXB528",
//       "adultProduct": false,
//       "autographed": false,
//       "brand": "ＳＯＵＳＩＡ",
//       "browseClassification":
//         {
//           "displayName": "標準型ノートパソコン",
//           "classificationId": "10610315051"
//         },
//       "itemClassification": "BASE_PRODUCT",
//       "itemName": "【整備済み品】富士通 ノートパソコン LIFEBOOK U9310 13.3型FHD(1920x1080) 超軽薄 ノートPC/第10世代 Core i5-10310U＠1.7GHz/ 8GB メモリ/高速ストレージ SSD/Webカメラ内蔵/WIFI/Type-C/HDMI/windows 11&MS Office 2019 搭載 パソコン (メモリ：8GB／SSD：256GB)",
//       "manufacturer": "ＳＯＵＳＩＡ",
//       "memorabilia": false,
//       "packageQuantity": 1,
//       "partNumber": "LIFEBOOK U9310-cr",
//       "size": "メモリ：8GB／SSD：256GB",
//       "tradeInEligible": false,
//       "websiteDisplayGroup": "pc_display_on_website",
//       "websiteDisplayGroupName": "Personal Computer"
//     }
//   ]
// }