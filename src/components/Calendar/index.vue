<template>
  <div class="calendar_root_container">
    <div class="action_section">
      <div>
        <input type="checkbox" v-model="only_work_hours" id="only_work_hours" />
        <label for="only_work_hours">Только рабочие часы (c {{ work_hours.start }} до {{ work_hours.end }})</label>
        <button type="button" @click="addEventDialog = true" v-if="!addEventDialog && editedItem == null">
          Новое событие
        </button>
        <button type="button" @click="cancel" v-else>Отменить</button>
      </div>
      <div>
        <button type="button" @click="setToday">Сегодня</button>&nbsp;&nbsp;
        <button type="button" @click="decrementWeek">&#8592;</button>
        &nbsp;{{ currentMonthName }}&nbsp;
        <button type="button" @click="incrementWeek">&#8594;</button>
      </div>
    </div>
    <div>
      <event-creator
        @saveevent="saveEvent"
        v-if="addEventDialog || editedItem"
        :ev="editedItem"
        :editmode="!addEventDialog"
      />
    </div>
    <div class="week_container">
      <div class="day_of_week" v-for="day_item in days_of_week" :key="day_item.number">
        <div class="day_title">{{ day_item.title }}</div>
        <div class="day_title">{{ addDayCalculate(day_item.number) }}</div>
      </div>
    </div>
    <div class="hours_container">
      <div class="day_of_week" v-for="day_item in days_of_week" :key="day_item.number">
        <div
          class="hour_item"
          v-for="(hour_item, i) in displayed_hours"
          :key="i"
          :style="`height: ${hour_item_height - 1}px;`"
        >
          <div class="time_value" v-if="day_item.number == 1">
            <span v-if="hour_item < 10">0</span>{{ hour_item }}:00
          </div>
        </div>
        <div
          class="events_container"
          :style="`height:${eventsContainerHeight}px;`"
          @drop="dropHandler($event)"
          @dragend.prevent="dragEndHandler"
          @dragenter.prevent="prepareDropDay = day_item.number"
          @dragover.prevent=""
          :class="{ prepare_drop: prepareDropDay == day_item.number }"
        >
          <event-component
            v-for="(evt, i) in eventsByDays[day_item.number]"
            :key="i"
            :evtdata="evt"
            :style="`top:${getEventTopPosition(evt.startDate, day_item.number)}px;`"
            @editevent="editEvent"
          ></event-component>
        </div>
      </div>
    </div>
    <div class="footer_section">
      <!-- <div>Событий на этой неделе: {{ eventsOnSelectedWeek.length }}</div> -->
      <div>{{ eventsByDays }}</div>
      <div>{{ data }}</div>
    </div>
  </div>
</template>

<script>
import calendar_events from '@/mock/calendar_events';
import DateUtils from '@/common/DateUtils.js';
import EventComponent from '../EventComponent';
import EventCreator from '../EventCreator';
import { EventManager, EventItem } from '@/common/EventManager';

export default {
  name: 'Calendar',
  components: { EventComponent, EventCreator },
  data() {
    this.work_hours = { start: 8, end: 19 };
    this.hour_item_height = DateUtils.hourItemHeight;

    return {
      only_work_hours: false,
      data: [],
      weekCounter: 0,
      monday: DateUtils.getMondayTS(),
      eventsByDays: {},
      prepareDropDay: 0,

      addEventDialog: false,
      editedItem: null,
    };
  },
  methods: {
    dragEndHandler() {
      this.prepareDropDay = 0;
    },
    dropHandler(event) {
      this.editedItem = null;
      this.addEventDialog = false;

      const dropDay = this.prepareDropDay;
      this.dragEndHandler();
      const offsetYstart = +event.dataTransfer.getData('offsety');
      let target_top = event.target.getBoundingClientRect().top;
      // подменяем таргет, если дроп над другим событием
      if (event.target.className === 'event-component-root') {
        const t_idx = event.path.findIndex((e) => e.className.includes('events_container'));
        this.dragEndHandler();
        if (t_idx == -1) return;
        target_top = event.path[t_idx].getBoundingClientRect().top;
      }
      const eventY = event.clientY - target_top;
      const offsetY = eventY - offsetYstart;

      if (offsetY < 0) return;
      const tsPeriod = 60 * 60 * this.displayed_hours.length;
      const deltaTS = (offsetY * tsPeriod) / this.eventsContainerHeight;
      const addNotWorkHours = this.only_work_hours ? 60 * 60 * this.work_hours.start : 0;
      const newStartTime =
        this.monday / 1000 + ((dropDay - 1) * DateUtils.dayTSPeriod) / 1000 + deltaTS + addNotWorkHours;

      const evtStr = event.dataTransfer.getData('evt');
      //вынужденно ищу событие таким образом, так как в исходных данных нет никакого уникального идентификатора (напр. ключа ID)
      const idx = this.data.findIndex((e) => JSON.stringify(e) === evtStr);
      // const idx = this.data.findIndex((e) => e.internalIdentiefer == evtStr.internalIdentiefer);
      if (idx == -1) return;
      const eventLength = this.data[idx].endDate - this.data[idx].startDate;
      this.$set(this.data[idx], 'startDate', DateUtils.roundDateProcessor(Math.round(newStartTime)));
      this.$set(this.data[idx], 'endDate', DateUtils.roundDateProcessor(Math.round(newStartTime + eventLength)));
      this.createStructure();
    },

    setToday() {
      this.monday = DateUtils.getMondayTS();
    },
    incrementWeek() {
      this.monday = new Date(this.monday / 1 + DateUtils.weekTSPeriod);
    },
    decrementWeek() {
      this.monday = new Date(this.monday / 1 - DateUtils.weekTSPeriod);
    },
    addDayCalculate(num) {
      return new Date(this.monday / 1 + (DateUtils.dayTSPeriod * num - 1)).getDate();
    },
    initEventsByDay() {
      this.eventsByDays = {};
      DateUtils.getDaysOfWeekDefaultsWeek.forEach((d) => this.$set(this.eventsByDays, d.number, []));
    },
    createStructure() {
      this.initEventsByDay();

      this.eventsOnSelectedWeek.forEach((e) => {
        const calcValue = (e.startDate * 1000 - this.monday) / DateUtils.dayTSPeriod;
        const dayNum = Math.ceil(calcValue) === 0 ? 1 : Math.ceil(calcValue);
        this.eventsByDays[dayNum].push(e);
      });
    },
    getTSStartOfDay(dayNum) {
      const coef = this.only_work_hours ? this.work_hours.start : 0;
      return (DateUtils.dayTSPeriod * (dayNum - 1) + this.monday / 1) / 1000 + coef * 60 * 60;
    },
    getTSEndOfDay(dayNum) {
      const coef = this.only_work_hours ? 24 - this.work_hours.end : 0;
      return (DateUtils.dayTSPeriod * dayNum + this.monday / 1) / 1000 - 1 - coef * 60 * 60;
    },

    getEventTopPosition(startDate, dayNum) {
      const ts0 = startDate;
      const ts1 = this.getTSStartOfDay(dayNum);
      const ts2 = this.getTSEndOfDay(dayNum);
      const px1 = 0;
      const px2 = this.eventsContainerHeight;

      return (px1 * (ts2 - ts1) + px2 * (ts0 - ts1)) / (ts2 - ts1);
    },

    saveEvent(ev) {
      const { title } = ev;

      const startDate =
        this.monday / 1000 +
        (DateUtils.dayTSPeriod * (ev.dayNum - 1) +
          DateUtils.hourTSPeriod * (ev.startTime.slice(0, 2) * 1) +
          (DateUtils.hourTSPeriod / 60) * (ev.startTime.slice(3, 5) * 1)) /
          1000;
      let endDate =
        this.monday / 1000 +
        (DateUtils.dayTSPeriod * (ev.dayNum - 1) +
          DateUtils.hourTSPeriod * (ev.endTime.slice(0, 2) * 1) +
          (DateUtils.hourTSPeriod / 60) * (ev.endTime.slice(3, 5) * 1)) /
          1000;

      if (endDate <= startDate) endDate = startDate + DateUtils.hourTSPeriod / 1000;

      if (this.addEventDialog) {
        this.data.push(new EventItem({ title, startDate, endDate }));
        this.addEventDialog = false;
      } else if (this.editedItem != null) {
        console.log('not null', this.editedItem);
        const idx = this.data.findIndex((e) => +e.internalIdentiefer === +this.editedItem.internalIdentiefer);
        if (idx === -1) return;
        this.$set(
          this.data,
          idx,
          new EventItem({ title, startDate, endDate, internalIdentiefer: this.editedItem.internalIdentiefer }),
        );
        console.log('idx', idx);
        this.editedItem = null;
      }
    },

    editEvent(ev) {
      const startTime = new Date(ev.startDate * 1000).toLocaleTimeString().slice(0, 5);
      const endTime = new Date(ev.endDate * 1000).toLocaleTimeString().slice(0, 5);
      this.editedItem = { title: ev.title, dayNum: 1, startTime, endTime, internalIdentiefer: ev.internalIdentiefer };
    },

    cancel() {
      this.addEventDialog = false;
      this.editedItem = null;
    },
  },
  watch: {
    monday() {
      this.createStructure();
    },
    data() {
      this.createStructure();
    },
  },
  computed: {
    days_of_week() {
      return DateUtils.getDaysOfWeekDefaultsWeek;
    },
    displayed_hours() {
      return this.only_work_hours
        ? DateUtils.createDefaultHoursList.filter((e) => e >= this.work_hours.start && e < this.work_hours.end)
        : DateUtils.createDefaultHoursList;
    },
    currentMonthName() {
      return DateUtils.monthsNames[this.monday.getMonth()];
    },
    eventsOnSelectedWeek() {
      return this.data.filter(
        (e) => e.startDate >= this.monday / 1000 && e.endDate < DateUtils.getNextModnayTS(this.monday / 1),
      );
    },
    eventsContainerHeight() {
      return this.displayed_hours.length * this.hour_item_height;
    },
  },
  created() {
    this.data = new EventManager(calendar_events);
  },
};
</script>

<style scoped>
.calendar_root_container {
  position: relative;
  width: 100%;
}
.action_section {
  position: relative;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding: 10px 10px 10px 10px;
}
.week_container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  padding-left: 50px;
}
.day_of_week {
  position: relative;
  flex-grow: 1;
  width: 100%;
  height: 100%;
}

.day_title {
  position: relative;
  width: 100%;
  height: 25px;
  font-size: 27;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
}
.hours_container {
  position: relative;
  width: 100%;
  height: 410px;

  overflow-x: hidden;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;

  display: flex;
  flex-flow: row nowrap;
  border: 1px solid grey;
  padding: 9px 0px 0px 50px;
}
.hours_container::-webkit-scrollbar {
  display: none;
}

.hour_item {
  position: relative;
  width: 100%;
  font-size: 25px;
  border-right: 1px solid grey;
  border-top: 1px solid grey;
  text-align: center;
}

.hour_item > span {
  text-align: right;
}
.time_value {
  position: absolute;
  left: -40px;
  top: -9px;
  font-size: 14px;
}

.events_container {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  box-sizing: content-box;
}

.footer_section {
  position: relative;
  width: 100%;
  padding: 5px 5px 5px 5px;
}

.prepare_drop {
  background-color: hsla(120, 34%, 49%, 0.229);
}
</style>
