<template>
  <div class="calendar_root_container">
    <div class="action_section">
      <div>
        <input type="checkbox" v-model="only_work_hours" id="only_work_hours" />
        <label for="only_work_hours">Только рабочие часы (c {{ work_hours.start }} до {{ work_hours.end }})</label>
      </div>
      <div>
        <button type="button" @click="setToday">Сегодня</button>&nbsp;&nbsp;
        <button type="button" @click="decrementWeek">&#8592;</button>
        &nbsp;{{ currentMonth }}&nbsp;
        <button type="button" @click="incrementWeek">&#8594;</button>
      </div>
    </div>
    <div class="week_container">
      <div class="day_of_week" v-for="day_item in days_of_week" :key="day_item.number">
        <div class="day_title">{{ day_item.title }}</div>
        <div class="day_title">{{ addDayCalculate(day_item.number) }}</div>
      </div>
    </div>
    <div class="hours_container">
      <div class="day_of_week" v-for="day_item in days_of_week" :key="day_item.number">
        <div class="hour_item" v-for="(hour_item, i) in displayed_hours" :key="i">
          <div class="time_value" v-if="day_item.number == 1">
            <span v-if="hour_item < 10">0</span>{{ hour_item }}:00
          </div>
        </div>
        <div class="events_container" :style="`height:${eventsContainerHeight}px;`">
          <event-component :only_work_hours="true" :eventdata="'eventdata'" />
        </div>
      </div>
    </div>
    <div class="footer_section">
      <div>Событий на этой неделе: {{ eventsOnSelectedWeek.length }}</div>
    </div>
  </div>
</template>

<script>
import calendar_events from '@/mock/calendar_events';
import DateUtils from '@/common/DateUtils.js';
import EventComponent from './EventComponent.vue';

export default {
  name: 'Calendar',
  components: { EventComponent },
  data() {
    this.days_of_week_default = DateUtils.getDaysOfWeekDefaultsWeek;
    this.default_hours = DateUtils.createDefaultHoursList;
    this.work_hours = { start: 8, end: 19 };
    this.weekTSPeriod = DateUtils.weekTSPeriod;

    return {
      only_work_hours: false,
      data: [],
      weekCounter: 0,
      monday: DateUtils.getMondayTS(),
    };
  },
  methods: {
    setToday() {
      this.monday = DateUtils.getMondayTS();
    },
    incrementWeek() {
      this.monday = new Date(this.monday / 1 + this.weekTSPeriod);
    },
    decrementWeek() {
      this.monday = new Date(this.monday / 1 - this.weekTSPeriod);
    },
    addDayCalculate(num) {
      return new Date(this.monday / 1 + DateUtils.dayTSPeriod * num).getDate();
    },
  },
  computed: {
    days_of_week() {
      return this.days_of_week_default;
    },
    displayed_hours() {
      return this.only_work_hours
        ? this.default_hours.filter((e) => e >= this.work_hours.start && e <= this.work_hours.end)
        : this.default_hours;
    },
    currentMonth() {
      // TODO: баг - результат на 1 меньше, когда 1 число месяца это понедельник
      return this.monday.getMonth() + 1;
    },
    nextModnayTS() {
      return new Date(this.monday / 1 + this.weekTSPeriod) / 1000;
    },
    eventsOnSelectedWeek() {
      return this.data.filter((e) => e.startDate > this.monday / 1000 && e.endDate < this.nextModnayTS);
    },
    eventsContainerHeight() {
      const hour_item_height = 51;
      if (this.only_work_hours) return hour_item_height * (this.work_hours.end - this.work_hours.start + 1);
      return hour_item_height * 24;
    },
  },
  created() {
    this.data = calendar_events;
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

.events_container {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% - 4px);
  border: 1px solid red;
  padding-left: 4px;
}

.hour_item {
  position: relative;
  width: 100%;
  height: 50px;
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
.footer_section {
  position: relative;
  width: 100%;
  padding: 5px 5px 5px 5px;
}
</style>
