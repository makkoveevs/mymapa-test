<template>
  <div>
    {{ data }}
  </div>
</template>

<script>
export default {
  name: "Calendar",
  data() {
    return {
      data: [
        { title: "Заголовок 1", startDate: 1585699200, endDate: 1585702800 },
        { title: "Заголовок 2", startDate: 1585706400, endDate: 1585710000 },
        { title: "Заголовок 3", startDate: 1585789200, endDate: 1585792800 },
        { title: "Заголовок 4", startDate: 1586307600, endDate: 1586311200 },
        { title: "Заголовок 5", startDate: 1585791500, endDate: 1585795100 },
        { title: "Заголовок 6", startDate: 1585706400, endDate: 1585710000 },
      ],
    };
  },
};
</script>

<style></style>
