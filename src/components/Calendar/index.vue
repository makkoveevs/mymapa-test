<template>
  <div class="calendar_root_container">
    <div>
      <input type="checkbox" v-model="only_work_hours" id="only_work_hours" />
      <label for="only_work_hours">Только рабочие часы (c {{ work_hours.start }} до {{ work_hours.end }})</label>
    </div>
    <div class="week_container">
      <div class="day_of_week" v-for="day_item in days_of_week" :key="day_item.number">
        <div class="day_title">{{ day_item.title }}</div>
        <div class="day_title">{{ day_item.title }}</div>
      </div>
    </div>
    <div class="hours_container">
      <div class="day_of_week" v-for="day_item in days_of_week" :key="day_item.number">
        <div class="hour_item" v-for="(hour_item, i) in displayed_hours" :key="i">
          <!-- <span class="time_value" v-if="day_item.number == 1 && hour_item != 0" -->
          <span class="time_value" v-if="day_item.number == 1"
            ><span v-if="hour_item < 10">0</span>{{ hour_item }}:00</span
          >
          <!-- {{ hour_item }} -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import calendar_events from '@/mock/calendar_events';

export default {
  name: 'Calendar',
  data() {
    this.days_of_week_default = [
      { number: 1, title: 'ПН' },
      { number: 2, title: 'ВТ' },
      { number: 3, title: 'СР' },
      { number: 4, title: 'ЧТ' },
      { number: 5, title: 'ПТ' },
      { number: 6, title: 'СБ' },
      { number: 7, title: 'ВС' },
    ];
    this.default_hours = Array.from({ length: 24 }, (x, i) => i);
    this.work_hours = { start: 8, end: 19 };

    return {
      only_work_hours: false,
      data: [],
    };
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
  overflow-y: auto;
  display: flex;
  flex-flow: row nowrap;
  border: 1px solid grey;
  padding: 9px 0px 0px 50px;
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
</style>
