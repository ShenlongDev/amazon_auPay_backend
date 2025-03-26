// https://developer-docs.amazon.com/sp-api/reference/product-pricing-v0

// using API
import spApi from '@api/sp-api';

spApi.getCompetitivePricing({
    MarketplaceId: 'A1VC38T7YXB528',
    Asins: 'B0BLS56CT4,B085G2227B',
    ItemType: 'Asin'
})
    .then(({ data }) => console.log(data))
    .catch(err => console.error(err));

// using axios
import axios from 'axios';

const options = {
    method: 'GET',
    url: 'https://sellingpartnerapi-na.amazon.com/products/pricing/v0/competitivePrice?MarketplaceId=A1VC38T7YXB528&Asins=B0BLS56CT4,B085G2227B&ItemType=Asin',
    headers: { accept: 'application/json' }
};

axios
    .request(options)
    .then(res => console.log(res.data))
    .catch(err => console.error(err));

// response
// {
//     "payload": [
//         {
//             "status": "string",
//             "SellerSKU": "string",
//             "ASIN": "string",
//             "Product": {
//                 "Identifiers": {
//                     "MarketplaceASIN": {
//                         "MarketplaceId": "string",
//                         "ASIN": "string"
//                     },
//                     "SKUIdentifier": {
//                         "MarketplaceId": "string",
//                         "SellerId": "string",
//                         "SellerSKU": "string"
//                     }
//                 },
//                 "AttributeSets": [
//                     {}
//                 ],
//                 "Relationships": [
//                     {}
//                 ],
//                 "CompetitivePricing": {
//                     "CompetitivePrices": [
//                         {
//                             "CompetitivePriceId": "string",
//                             "Price": {
//                                 "LandedPrice": {
//                                     "CurrencyCode": "string",
//                                     "Amount": 0
//                                 },
//                                 "ListingPrice": {
//                                     "CurrencyCode": "string",
//                                     "Amount": 0
//                                 },
//                                 "Shipping": {
//                                     "CurrencyCode": "string",
//                                     "Amount": 0
//                                 },
//                                 "Points": {
//                                     "PointsNumber": 0,
//                                     "PointsMonetaryValue": {
//                                         "CurrencyCode": "string",
//                                         "Amount": 0
//                                     }
//                                 }
//                             },
//                             "condition": "string",
//                             "subcondition": "string",
//                             "offerType": "B2C",
//                             "quantityTier": 0,
//                             "quantityDiscountType": "QUANTITY_DISCOUNT",
//                             "sellerId": "string",
//                             "belongsToRequester": true
//                         }
//                     ],
//                     "NumberOfOfferListings": [
//                         {
//                             "Count": 0,
//                             "condition": "string"
//                         }
//                     ],
//                     "TradeInValue": {
//                         "CurrencyCode": "string",
//                         "Amount": 0
//                     }
//                 },
//                 "SalesRankings": [
//                     {
//                         "ProductCategoryId": "string",
//                         "Rank": 0
//                     }
//                 ],
//                 "Offers": [
//                     {
//                         "offerType": "B2C",
//                         "BuyingPrice": {
//                             "LandedPrice": {
//                                 "CurrencyCode": "string",
//                                 "Amount": 0
//                             },
//                             "ListingPrice": {
//                                 "CurrencyCode": "string",
//                                 "Amount": 0
//                             },
//                             "Shipping": {
//                                 "CurrencyCode": "string",
//                                 "Amount": 0
//                             },
//                             "Points": {
//                                 "PointsNumber": 0,
//                                 "PointsMonetaryValue": {
//                                     "CurrencyCode": "string",
//                                     "Amount": 0
//                                 }
//                             }
//                         },
//                         "RegularPrice": {
//                             "CurrencyCode": "string",
//                             "Amount": 0
//                         },
//                         "businessPrice": {
//                             "CurrencyCode": "string",
//                             "Amount": 0
//                         },
//                         "quantityDiscountPrices": [
//                             {
//                                 "quantityTier": 0,
//                                 "quantityDiscountType": "QUANTITY_DISCOUNT",
//                                 "listingPrice": {
//                                     "CurrencyCode": "string",
//                                     "Amount": 0
//                                 }
//                             }
//                         ],
//                         "FulfillmentChannel": "string",
//                         "ItemCondition": "string",
//                         "ItemSubCondition": "string",
//                         "SellerSKU": "string"
//                     }
//                 ]
//             }
//         }
//     ],
//         "errors": [
//             {
//                 "code": "string",
//                 "message": "string",
//                 "details": "string"
//             }
//         ]
// }