<template>
  <div
    @dragstart="startDragHandler($event, evtdata)"
    draggable="true"
    class="event-component-root"
    :style="`height:${eventsComponentHeight}px;`"
    @dblclick="editEvent"
  >
    <div>{{ evtdata.title }}</div>
    <div>{{ startTime }} - {{ endTime }}</div>
  </div>
</template>

<script>
import DateUtils from '@/common/DateUtils';
import { EventItem } from '@/common/EventManager';

export default {
  name: 'EventComponent',
  props: {
    evtdata: {
      type: Object,
      default: function() {
        return new EventItem();
      },
    },
  },
  methods: {
    startDragHandler(event, evt) {
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('evt', JSON.stringify(evt));
      event.dataTransfer.setData('offsety', `${event.offsetY}`);
    },
    editEvent() {
      this.$emit('editevent', this.evtdata);
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
    startTime() {
      return new Date(this.$props.evtdata.startDate * 1000).toLocaleTimeString().slice(0, 5);
    },
    endTime() {
      return new Date(this.$props.evtdata.endDate * 1000).toLocaleTimeString().slice(0, 5);
    },
  },
};
</script>

<style scoped>
.event-component-root {
  left: 4px;
  position: absolute;
  width: 120px;
  border: 1px solid grey;
  border-radius: 3px;
  box-sizing: border-box;
  font-size: 12px;
  background-color: hsla(60, 34%, 49%, 0.329);
  padding-left: 2px;
}
</style>
