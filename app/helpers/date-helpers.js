

function DateHelpers() {
    this.moment = require('moment');
}

DateHelpers.prototype.isInPast = function (date) {
    return this.moment(date).format("YYYY/MM/DD") < this.moment("YYYY/MM/DD");
};

DateHelpers.prototype.isInFuture = function (date) {
    return this.moment(date).format("YYYY/MM/DD") > this.moment().format("YYYY/MM/DD");
};

DateHelpers.prototype.getDateType = function (date) {
    if (this.isInFuture(date)) {
        return 'upcoming';
    }

    if (this.isInPast(date)) {
        return 'past';
    }

    return 'ongoing';
};

module.exports = DateHelpers;