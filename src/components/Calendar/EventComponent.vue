<template>
  <div class="event-component-root" :style="`height:${eventsComponentHeight}px;`">
    <div>{{ only_work_hours }}</div>
    {{ eventdata }}
  </div>
</template>

<script>
export default {
  name: 'EventComponent',
  props: ['only_work_hours', 'eventdata'],
  computed: {
    eventsComponentHeight() {
      return 50;
    },
  },
};
</script>

<style scoped>
.event-component-root {
  position: relative;
  width: 90%;
  border: 1px solid blue;
}
</style>
