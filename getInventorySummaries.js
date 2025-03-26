// https://developer-docs.amazon.com/sp-api/reference/fba-inventory-v1

// using API
import spApi from '@api/sp-api';

spApi.getInventorySummaries({
    details: 'false',
    granularityType: 'Marketplace',
    granularityId: 'A1VC38T7YXB528',
    sellerSkus: '',
    sellerSku: 'B085G2227B',
    marketplaceIds: 'A1VC38T7YXB528'
})
    .then(({ data }) => console.log(data))
    .catch(err => console.error(err));

// using axios
const axios = require('axios');

let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://sellingpartnerapi-fe.amazon.com/fba/inventory/v1/summaries?granularityType=Marketplace&granularityId=A1VC38T7YXB528&sellerSkus=B085G2227B,B0BLS56CT4&marketplaceIds=A1VC38T7YXB528',
    headers: {
        'x-amz-access-token': 'YOUR_ACCESS_TOKEN',
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
//     "payload": {
//         "granularity": {
//             "granularityType": "string",
//                 "granularityId": "string"
//         },
//         "inventorySummaries": [
//             {
//                 "asin": "string",
//                 "fnSku": "string",
//                 "sellerSku": "string",
//                 "condition": "string",
//                 "inventoryDetails": {
//                     "fulfillableQuantity": 0,
//                     "inboundWorkingQuantity": 0,
//                     "inboundShippedQuantity": 0,
//                     "inboundReceivingQuantity": 0,
//                     "reservedQuantity": {
//                         "totalReservedQuantity": 0,
//                         "pendingCustomerOrderQuantity": 0,
//                         "pendingTransshipmentQuantity": 0,
//                         "fcProcessingQuantity": 0
//                     },
//                     "researchingQuantity": {
//                         "totalResearchingQuantity": 0,
//                         "researchingQuantityBreakdown": [
//                             {
//                                 "name": "researchingQuantityInShortTerm",
//                                 "quantity": 0
//                             }
//                         ]
//                     },
//                     "unfulfillableQuantity": {
//                         "totalUnfulfillableQuantity": 0,
//                         "customerDamagedQuantity": 0,
//                         "warehouseDamagedQuantity": 0,
//                         "distributorDamagedQuantity": 0,
//                         "carrierDamagedQuantity": 0,
//                         "defectiveQuantity": 0,
//                         "expiredQuantity": 0
//                     }
//                 },
//                 "lastUpdatedTime": "2025-03-26T13:01:06.502Z",
//                 "productName": "string",
//                 "totalQuantity": 0,
//                 "stores": [
//                     "string"
//                 ]
//             }
//         ]
//     },
//     "pagination": {
//         "nextToken": "string"
//     },
//     "errors": [
//         {
//             "code": "string",
//             "message": "string",
//             "details": "string"
//         }
//     ]
// }