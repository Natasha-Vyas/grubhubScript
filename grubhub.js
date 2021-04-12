var axios = require('axios');
const { Sequelize, QueryTypes } = require('sequelize');

async function connect() {
    // let sequelize = new Sequelize(`mysql://root:Natasha$362436@localhost:3306/gkc_husky`);
    let sequelize = new Sequelize('mysql://digiprex:LDcF4K0lD0tSTJYwIUmi@digiprexapi.ctky9owxz1tq.ap-south-1.rds.amazonaws.com:3306/gkc_husky');
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        return sequelize;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

async function getResponse(merchantUuid, token, sequelize, id,sequelize1) {
    var moment = require('moment-timezone');
var date = moment().tz("America/Chicago").format( "YYYY-MM-DD");
var add = moment().add(7, 'd').format("YYYY-MM-DD");
// console.log(date)
// console.log(add)
    try {
        let config =
        {
            method: 'get',
            url: `https://api-order-processing-gtm.grubhub.com/merchant/accounting/v1/${merchantUuid}/transactions?timeZone=America/Chicago&startDate=2021-03-12&endDate=2021-04-12`,
            headers: {
                'authority': 'api-order-processing-gtm.grubhub.com',
                'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
                'accept': 'application/json',
                'authorization': `Bearer ${token}`,
                'sec-ch-ua-mobile': '?0',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
                'content-type': 'application/json',
                'origin': 'https://restaurant.grubhub.com',
                'sec-fetch-site': 'same-site',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                'referer': 'https://restaurant.grubhub.com/',
                'accept-language': 'en-US,en;q=0.9',
            }
        };
        let result = await axios(config)
        let data = result.data
        for (let i = 0; i < data.length; i++){
        let transId = result.data[i].transaction_id
        // console.log(transId)
        run2(merchantUuid, token, transId, data, sequelize, id,sequelize1);
        }
        // console.log("dattttttttttttttt",data)
    } catch (error) {
        console.log(error)
    }
}


run();
async function storeData(orders, id ,sequelize1) {
    try {
        // await sequelize.query('SET FOREIGN_KEY_CHECKS=0');
        // if (orders.order_id) {
        //     let customer_id = await sequelize.query('Select customer_id from  `customer` where customer_id=?', { replacements: [orders.order_id], type: QueryTypes.SELECT });
        //         if (customer_id.length)
        //             await sequelize.query('update   `customer` set name=?,phone=? where customer_id=?', { replacements: [orders.customer_name, orders.customer_phone, customer_id[0].customer_id], type: QueryTypes.INSERT });
        //         else
        //             await sequelize.query('insert into customer (customer_id,name,phone) values(?,?,?)', { replacements: [orders.order_id, orders.customer_name, orders.customer_phone], type: QueryTypes.INSERT });
        //     }
            if (orders.order_id) {
                let order_id = await sequelize1.query('Select order_id from  `order` where order_id=?', { replacements: [orders.order_id], type: QueryTypes.SELECT });
                if (order_id.length)
                    await sequelize1.query('update   `order` set uuid=?,sub_total=?,tax=?,total=?,branch_platform_id=?,status=?,note=?,order_recieved_time=?,order_recieved_date=?,order_confirmed_date=?,order_out_for_delivery_date=? where order_id=?',
                        {
                            replacements: [
                                orders.uuid, 
                                orders.sub_total_charges, 
                                orders.total_tax,
                                orders.total_charges, 
                                id ,
                                orders.status, 
                                orders.note, 
                                orders.placed_time, 
                                orders.orderRecievedDate,
                                orders.orderConfirmedDate, 
                                orders.orderOutForDeliveryDate,
                                order_id[0].order_id
                            ], type: QueryTypes.INSERT
                        });
                else {
                    // let customer_id = await sequelize1.query('select id from `customer` where customer_id=? ', { replacements: [orders.order_id], type: QueryTypes.SELECT });

                    await sequelize1.query('insert  into `order` (order_id,sub_total,tax,total,branch_platform_id,status,note,order_recieved_time,order_recieved_date,order_confirmed_date,order_ready_date,order_out_for_delivery_date) values(?,?,?,?,?,?,?,?,?,?,?,?)',
                        {
                            replacements: [
                            orders.order_id, 
                            orders.sub_total_charges, 
                            orders.total_tax,
                            orders.total_charges, 
                            id , 
                            orders.status, 
                            orders.note, 
                            orders.placed_time, 
                            orders.orderRecievedDate,
                            orders.orderConfirmedDate,
                            orders.orderReadyDate,
                            orders.orderOutForDeliveryDate
                            ], type: QueryTypes.INSERT
                        });
                }
            }
            if (orders.item.length) {
                for (let i = 0; i < orders.item.length; i++) {
                    
                    let order_id = await sequelize1.query('select id from `order` where order_id=? ', { replacements: [orders.order_id], type: QueryTypes.SELECT });
                    if (order_id.length) {
                        let item_id = await sequelize1.query('select id,order_id from `item` where item_id=? and order_id=?', { replacements: [orders.item[i].item_id, order_id[0].id], type: QueryTypes.SELECT });
                        if (!item_id.length) {
                            if (order_id.length) {
                                await sequelize1.query('insert  into item (item_id,item_name,price,quantity,order_id) values(?,?,?,?,?)', { replacements: [orders.item[i].item_id, orders.item[i].item_name, orders.item[i].item_price, orders.item[i].item_quantity, order_id[0].id], type: QueryTypes.INSERT });
                            }
                            // await sequelize.query('REPLACE  into item (item_id,item_name,price,quantity,order_id) values(?,?,?,?,?)', { replacements: [orders.item[i].item_id, orders.item[i].item_name, orders.item[i].item_price, orders.item[i].item_quantity, orders.order_id], type: QueryTypes.INSERT });
                        }

                    }
                }
            }

    }catch (error) {
            console.log(error);
        }
    }

async function transformData(data, item) {
        // console.log("orderrrrrr", data, "itemmmmmmmm", item);
        order_details = [];
        let charges = item;
        let status = orderRecievedDate = orderReadyDate = orderConfirmedDate = orderOutForDeliveryDate = orderDeliveryDate = orderPreparationTime = "NULL";
        let modifiedOrderRecievedDate = modifiedOrderRecievedTime = modifiedOrderReadyDate = modifiedOrderReadyTime = modifiedOrderConfirmedDate = modifiedOrderConfirmedTime = modifiedOrderOutForDeliveryDate = modifiedOrderOutForDeliveryTime = modifiedOrderDeliveryDate = modifiedOrderDeliveryTime = "NULL";
        let note = "NULL";
        // if (order.order_change_status_name) {
        // let state = data.order_change_status_name;
        // console.log("state", state)

        for (let i = 0; i <1; i++) {
            for (key in charges) {
                total_charge = charges[key].restaurant_total;
                tax = charges[key].restaurant_sales_tax;
                subtotal = charges[key].subtotal;
            }
        }

        for (let i = 0; i < data.order_details.length; i++) {
            let item = {
                item_id: data.order_details[i].line_id,//done
                item_name: data.order_details[i].name,
                item_price: Number(data.order_details[i].price),
                item_quantity: data.order_details[i].quantity
            }
            order_details.push(item);
            // console.log("itemmmmmmmm", item)
        }
        // console.log("itemmmmmmmmmmmm", item)
        // console.log("orderdetailsssssssssss", data.order_details,)
        let orders = {
            item: order_details,
            // uuid: data.order_details[0].line_uuid,
            order_id: data.order_details[0].line_id,
            sub_total_charges: subtotal,
            total_tax: tax,
            total_charges: total_charge,
            note: note,
            status: data.order_change_status_name,
            placed_time: modifiedOrderRecievedTime,
            orderRecievedDate: modifiedOrderRecievedDate,
            orderConfirmedDate: data.status_events.confirmed,
            orderOutForDeliveryDate: data.status_events.out_for_delivery,
            order_count: data.order_details.length,
            platform_name: "GRUBHUB",
        }
        console.log("orderListtt", orders)
        let transformed_data = [orders];
        return transformed_data;
    }

    async function run() {
        let sequelize = await connect();
        let sequelize1 = await connect1();
        await getCredentials(sequelize,sequelize1);
    }

    async function getCredentials(sequelize,sequelize1) {
        try {
            let branch_details = await sequelize.query('select s.token, b.id as mid, b.email, b.`password`, b.place_uuid, b.merchant_uuid, br.branch_name, br.location, p.`platform_name` from `branch_platform` as b join session as s on b.id=s.branch_platform_id JOIN `branch` as br ON  `b`.branch_id=br.id  JOIN platforms as p ON b.platform_id=p.id where b.platform_id="2" and b.merchant_uuid is not null', { type: QueryTypes.SELECT });
            for (let i = 0; i < branch_details.length; i++) {
                let some = branch_details[i]
                let merchantUuid = branch_details[i].merchant_uuid;
                let token = branch_details[i].token;
                let id = branch_details[i].mid;
                // console.log("someeeeeeeeeeeeee", some)
                // console.log("dataaaaaaaaa", merchantUuid, "tokennnnnnn",token, "ssssssssss",sequelize, "idddddddd", id, "details", branch_details)
                let response = await getResponse(merchantUuid, token, sequelize, id,sequelize1)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function connect1(){
    
            let sequelize1 = new Sequelize(`mysql://root:Natasha$362436@localhost:3306/gkc_husky`);
    // let sequelize1 = new Sequelize('mysql://digiprex:LDcF4K0lD0tSTJYwIUmi@digiprexapi.ctky9owxz1tq.ap-south-1.rds.amazonaws.com:3306/gkc_husky');
    try {
        await sequelize1.authenticate();
        console.log('Connection has been established successfully.');
        return sequelize1;
    } 
        catch(error){
            console.log(error)
        }
    }

    async function run2(merchantUuid, token, transId, item, sequelize, id,sequelize1) {
        // console.log("ppppppppppppppppppppp", merchantUuid, token, sequelize, id)
        var axios = require('axios');
        try {
            let config = {
                method: 'get',
                url: `https://api-order-processing-gtm.grubhub.com/merchant/accounting/v1/${merchantUuid}/orders/transactions/${transId}`,
                headers: {
                    'authority': 'api-order-processing-gtm.grubhub.com',
                    'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
                    'accept': 'application/json',
                    'authorization': `Bearer ${token}`,
                    'sec-ch-ua-mobile': '?0',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
                    'content-type': 'application/json',
                    'origin': 'https://restaurant.grubhub.com',
                    'sec-fetch-site': 'same-site',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'referer': 'https://restaurant.grubhub.com/',
                    'accept-language': 'en-US,en;q=0.9',
                }
            };

            let result = await axios(config)
            let data = result.data
            // console.log("outputtttt",data)
            for(let i=0; i<1; i++){
            let transformer = await transformData(data, item,sequelize1);
            await storeData(transformer[0], id, sequelize1);
            }
                } catch (error) {
            console.log(error)
        }
    }
