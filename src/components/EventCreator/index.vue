<template>
  <div>
    <input type="text" v-model="evt.title" />
    <select v-model.number="evt.dayNum">
      <option v-for="day in dayNameList" :key="day.number" :value="day.number">{{ day.title }}</option>
    </select>
    Начало<input type="time" v-model="evt.startTime" /> Конец<input type="time" v-model="evt.endTime" />
    <button type="button" @click="create">
      <span v-if="editmode">Сохранить</span>
      <span v-else>Создать</span>
    </button>
  </div>
</template>

<script>
import DateUtils from '@/common/DateUtils';

export default {
  name: 'EventCreator',
  props: {
    editmode: {
      type: Boolean,
      default: false,
    },
    ev: {
      type: Object,
      default: function() {
        return {
          title: '',
          dayNum: 1,
          startTime: '08:00',
          endTime: '09:00',
        };
      },
    },
  },
  data() {
    return {
      evt: null,
    };
  },
  methods: {
    create() {
      this.$emit('saveevent', this.evt);
    },
  },
  created() {
    this.dayNameList = DateUtils.getDaysOfWeekDefaultsWeek;
    if (this.$props.editmode) {
      this.evt = this.$props.ev;
    } else {
      this.evt = {
        title: '',
        dayNum: 1,
        startTime: '08:00',
        endTime: '09:00',
      };
    }
  },
};
</script>

<style scoped></style>
