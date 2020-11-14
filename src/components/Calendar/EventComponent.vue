<template>
  <div
    @dragstart="startDragHandler($event, evtdata)"
    class="event-component-root"
    :style="`height:${eventsComponentHeight}px;`"
  >
    {{ evtdata.title }}
  </div>
</template>

<script>
import DateUtils from '@/common/DateUtils';

export default {
  name: 'EventComponent',
  props: ['evtdata'],
  methods: {
    startDragHandler(event, evt) {
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('evt', JSON.stringify(evt));
      event.dataTransfer.setData('offsety', `${event.offsetY}`);
    },
  },
  computed: {
    eventsComponentHeight() {
      const hour_item_height = 51;
      return (
        ((this.$props.evtdata.endDate - this.$props.evtdata.startDate) * 1000 * hour_item_height) /
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
  border: 1px solid grey;
  border-radius: 3px;
  box-sizing: border-box;
  font-size: 12px;
  background-color: hsla(60, 34%, 49%, 0.329);
  padding-left: 2px;
}
</style>
