const db = require('monk')('localhost/tokens'); //coin tokens
const tokens = db.get('tokens');

const model = require('../model/market.js');


const getMarkets = async (ctx) => {
  try {
    // console.log(ctx.params.period);
    // switch(ctx.params.period) {
    //   case 'hour':
    //     break;
    //   case 'day':
    //     break;
    //   case 'week':
    //     break;
    //   case 'month':
    //     break;
    //   default:
    //     console.log('Wrong endpoint');
    // }
    const aggregate = await tokens.aggregate([
      {
        $match: {
          timestamp: {
            $gte: new Date((new Date()).getTime() - 1000*3600*5)
          }
        },
      }, {
        $group: {
          _id: {
            id: "$id",
            year: { $year: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
            hour: { $hour: "$timestamp" },
            minute: { $minute: "$timestamp" }
          },
          value: { $avg: "$price" }
        }
      }
    ])
    // console.log(aggregate);
    const processed = aggregate.reduce((accum, el) => {
      if(!accum[el._id.id]) {
        accum[el._id.id] = {
          id: el._id.id,
          values: [el.value]
        }
      } else {
        accum[el._id.id].values.push(el.value)
      }
      console.log(accum);
      return accum;
    }, {});
    console.log(processed);
    // let hour = await tokens.aggregate([
    //   {
    //
    //   }
    // ])
    // console.log(hour);
    // await ctx.send(ctx.response.body);
  } catch (e) { }
}

module.exports = {
  getMarkets,
}

getMarkets();
