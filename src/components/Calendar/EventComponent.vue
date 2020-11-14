<template>
  <div class="event-component-root" :style="`height:${eventsComponentHeight}px;`">
    {{ eventdata.title }}
  </div>
</template>

<script>
import DateUtils from '@/common/DateUtils';

export default {
  name: 'EventComponent',
  props: ['only_work_hours', 'eventdata'],
  computed: {
    eventsComponentHeight() {
      const hour_item_height = 51;
      return (
        ((this.$props.eventdata.endDate - this.$props.eventdata.startDate) * 1000 * hour_item_height) /
        DateUtils.hourTSPeriod
      );
    },
  },
};
</script>

<style scoped>
.event-component-root {
  position: relative;
  width: 90%;
  border: 1px solid blue;
  top: 10px;
  font-size: 12px;
  background-color: hsla(120, 34%, 49%, 0.329);
  padding-left: 2px;
}
</style>
