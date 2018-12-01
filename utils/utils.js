const moment = require('moment');

exports.responder = (res, code, status, result) => {

}

exports.date  = async (val) => {
  let date = new Date(val).getTime();
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
}