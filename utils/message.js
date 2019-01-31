function getTimeString() {
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + 's';
  var dateTime = time+' / '+date;
return dateTime
};

var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: getTimeString()
  };
};

let generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: getTimeString()
  };
};

module.exports = {generateMessage, generateLocationMessage};
