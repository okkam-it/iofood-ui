<template>
  <div>
    <!-- <div
      class="item"
      :style="'--value: ' + percentage > 100 ? 100 : percentage + '; --value2: ' + percentage - 100"
    >-->
    <div class="item" :style="'--value: ' + percentage + '; --valueover: ' + percentageOver">
      <div class="inner-text" v-if="!small">
        <p class="title">{{title}}</p>
        <p class="sub1">{{sub1}}</p>
        <p class="sub2">{{sub2}}</p>
      </div>
      <svg width="160" height="160" xmlns="http://www.w3.org/2000/svg">
        <g>
          <title>Layer 1</title>
          <circle r="60" cy="81" cx="81" stroke-width="8" stroke="#f2f2f2" fill="none" />
          <circle
            class="circle_animation1"
            r="60"
            cy="81"
            cx="81"
            stroke-width="8"
            :stroke="circleHex"
            fill="none"
          />
          <template v-if="value > 100">
            <circle
              class="circle_animation2"
              r="60"
              cy="81"
              cx="81"
              stroke-width="8"
              stroke="#df4759"
              fill="none"
            />
          </template>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: "DonutChart",
  components: {},
  data() {
    return {
      percentage: 377 - (this.value > 100 ? 100 : this.value) * 3.77,
      percentageOver: 377 - (this.value - 100) * 3.77
    };
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    sub1: {
      type: String,
      default: ""
    },
    sub2: {
      type: String,
      default: ""
    },
    value: {
      type: Number,
      default: 0
    },
    small: {
      type: Boolean
    }
  },
  methods: {},
  computed: {
    circleHex() {
      var val = this.value;
      if (val > 80) {
        return  '#f7d4d8';
      }
      if (val > 60) {
        return  '#ffdd99';
      }
      return "#c2f0c2";

      // return value > 100 ? '#f7d4d8' : /* '#17a2b8' */'#ccc'
    }
  }
};
</script>

<style scoped>
p {
  margin-bottom: 0;
}

.item {
  position: relative;
  float: left;
}

.item .inner-text {
  text-align: center;
  position: absolute;
  /* line-height: 125px; */
  height: 100%;
  width: 100%;
  padding-top: 45px;
}

.item .inner-text p.title {
  font-weight: bold;
  font-size: 15px;
}

.item .inner-text p.sub1 {
  font-size: 20px;
  color: var(--info-color);
  font-weight: bold;
}

.item .inner-text p.sub2 {
  font-size: 14px;
  color: #808080;
  font-weight: bold;
}

svg {
  -webkit-transform: rotate(-90deg);
  transform: rotate(-90deg);
}

.circle_animation1,
.circle_animation2 {
  stroke-dasharray: 377; /* this value is the pixel circumference of the circle */
  /* stroke-dashoffset: 188.5; */
  stroke-dashoffset: 377;
}

.item .circle_animation1 {
  /* -webkit-animation: item 1s ease-out forwards;
  animation: item 1s ease-out forwards; */
  stroke-dashoffset: var(--value);
  /* stroke-dashoffset: var(--value); */
}

.item .circle_animation2 {
  /* -webkit-animation: item2 1s ease-out forwards;
  animation: item2 1s ease-out forwards; */
  /* stroke-dasharray: 69, 100; */
  /* stroke-dashoffset: var(--value2); */
  stroke-dashoffset: var(--valueover);
}

/* .css .circle_animation {
  -webkit-animation: css 1s ease-out forwards;
  animation: css 1s ease-out forwards;
} */

/* @-webkit-keyframes item1 {
  to {
    stroke-dashoffset: var(
      --value1
    );  180;  50% would be 220 (half the initial value specified above) 
  }
} */

/* @-webkit-keyframes item {
  to {
    stroke-dashoffset: var(--value);
  }
}

@keyframes item {
  to {
    stroke-dashoffset: var(--value);
  }
}

@-webkit-keyframes item2 {
  to {
    stroke-dashoffset: var(
      --value2
    );
  }
}

@keyframes item2 {
  to {
    stroke-dashoffset: var(--value2);
  }
} */

/* @-webkit-keyframes css {
  to {
    stroke-dashoffset: 160;
  }
}

@keyframes css {
  to {
    stroke-dashoffset: 160;
  }
} */
</style>
