let i = 0;
import DateUtils from './DateUtils';

class EventItem {
  constructor({
    internalIdentiefer = null,
    title = '',
    startDate = new Date() / 1000,
    endDate = new Date() / 1000,
  } = {}) {
    this.internalIdentiefer =
      internalIdentiefer == null || internalIdentiefer == undefined
        ? this.constructor.idGenerator()
        : internalIdentiefer;
    this.title = title;
    this.startDate = this.constructor.startDateProcessor(startDate);
    this.endDate = this.endDateProcessor(endDate);
  }

  static startDateProcessor(ts) {
    return DateUtils.roundDateProcessor(ts);
  }
  static idGenerator() {
    return i++;
  }

  endDateProcessor(ts) {
    const minLength = 60;
    let ret = DateUtils.roundDateProcessor(ts);
    if (ret < this.startDate + minLength) ret = this.startDate + minLength;
    return ret;
  }
}

class EventManager {
  constructor(data) {
    return this.constructor.eventProcessor(data);
  }

  static eventProcessor(data = []) {
    if (!Array.isArray(data)) return [];
    return data.map((e) => new EventItem({ ...e, internalIdentiefer: i++ }));
  }
}

export { EventManager, EventItem };
