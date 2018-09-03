webpackJsonp([1],{

/***/ 199:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["default"] = initUserProfile;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_js_cookie__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_js_cookie___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_js_cookie__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__user_tabs__ = __webpack_require__(201);



function initUserProfile(action) {
  // place profile avatars to top
  $('.profile-groups-avatars').tooltip({
    placement: 'top',
  });

  // eslint-disable-next-line no-new
  new __WEBPACK_IMPORTED_MODULE_1__user_tabs__["a" /* default */]({ parentEl: '.user-profile', action });

  // hide project limit message
  $('.hide-project-limit-message').on('click', (e) => {
    e.preventDefault();
    __WEBPACK_IMPORTED_MODULE_0_js_cookie___default.a.set('hide_project_limit_message', 'false');
    $(this).parents('.project-limit-message').remove();
  });
}


/***/ }),

/***/ 200:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_underscore__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_underscore__);
throw new Error("Cannot find module \"d3\"");



const LOADING_HTML = `
  <div class="text-center">
    <i class="fa fa-spinner fa-spin user-calendar-activities-loading"></i>
  </div>
`;

function getSystemDate(systemUtcOffsetSeconds) {
  const date = new Date();
  const localUtcOffsetMinutes = 0 - date.getTimezoneOffset();
  const systemUtcOffsetMinutes = systemUtcOffsetSeconds / 60;
  date.setMinutes((date.getMinutes() - localUtcOffsetMinutes) + systemUtcOffsetMinutes);
  return date;
}

function formatTooltipText({ date, count }) {
  const dateObject = new Date(date);
  const dateDayName = gl.utils.getDayName(dateObject);
  const dateText = dateObject.format('mmm d, yyyy');

  let contribText = 'No contributions';
  if (count > 0) {
    contribText = `${count} contribution${count > 1 ? 's' : ''}`;
  }
  return `${contribText}<br />${dateDayName} ${dateText}`;
}

const initColorKey = () => __WEBPACK_IMPORTED_MODULE_1_d3___default.a.scale.linear().range(['#acd5f2', '#254e77']).domain([0, 3]);

class ActivityCalendar {
  constructor(container, timestamps, calendarActivitiesPath, utcOffset = 0) {
    this.calendarActivitiesPath = calendarActivitiesPath;
    this.clickDay = this.clickDay.bind(this);
    this.currentSelectedDate = '';
    this.daySpace = 1;
    this.daySize = 15;
    this.daySizeWithSpace = this.daySize + (this.daySpace * 2);
    this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.months = [];

    // Loop through the timestamps to create a group of objects
    // The group of objects will be grouped based on the day of the week they are
    this.timestampsTmp = [];
    let group = 0;

    const today = getSystemDate(utcOffset);
    today.setHours(0, 0, 0, 0, 0);

    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const days = gl.utils.getDayDifference(oneYearAgo, today);

    for (let i = 0; i <= days; i += 1) {
      const date = new Date(oneYearAgo);
      date.setDate(date.getDate() + i);

      const day = date.getDay();
      const count = timestamps[date.format('yyyy-mm-dd')] || 0;

      // Create a new group array if this is the first day of the week
      // or if is first object
      if ((day === 0 && i !== 0) || i === 0) {
        this.timestampsTmp.push([]);
        group += 1;
      }

      // Push to the inner array the values that will be used to render map
      const innerArray = this.timestampsTmp[group - 1];
      innerArray.push({ count, date, day });
    }

    // Init color functions
    this.colorKey = initColorKey();
    this.color = this.initColor();

    // Init the svg element
    this.svg = this.renderSvg(container, group);
    this.renderDays();
    this.renderMonths();
    this.renderDayTitles();
    this.renderKey();

    // Init tooltips
    $(`${container} .js-tooltip`).tooltip({ html: true });
  }

  // Add extra padding for the last month label if it is also the last column
  getExtraWidthPadding(group) {
    let extraWidthPadding = 0;
    const lastColMonth = this.timestampsTmp[group - 1][0].date.getMonth();
    const secondLastColMonth = this.timestampsTmp[group - 2][0].date.getMonth();

    if (lastColMonth !== secondLastColMonth) {
      extraWidthPadding = 3;
    }

    return extraWidthPadding;
  }

  renderSvg(container, group) {
    const width = ((group + 1) * this.daySizeWithSpace) + this.getExtraWidthPadding(group);
    return __WEBPACK_IMPORTED_MODULE_1_d3___default.a.select(container)
      .append('svg')
        .attr('width', width)
        .attr('height', 167)
        .attr('class', 'contrib-calendar');
  }

  renderDays() {
    this.svg.selectAll('g').data(this.timestampsTmp).enter().append('g')
      .attr('transform', (group, i) => {
        __WEBPACK_IMPORTED_MODULE_0_underscore___default.a.each(group, (stamp, a) => {
          if (a === 0 && stamp.day === 0) {
            const month = stamp.date.getMonth();
            const x = (this.daySizeWithSpace * i) + 1 + this.daySizeWithSpace;
            const lastMonth = __WEBPACK_IMPORTED_MODULE_0_underscore___default.a.last(this.months);
            if (
              lastMonth == null ||
              (month !== lastMonth.month && x - this.daySizeWithSpace !== lastMonth.x)
            ) {
              this.months.push({ month, x });
            }
          }
        });
        return `translate(${(this.daySizeWithSpace * i) + 1 + this.daySizeWithSpace}, 18)`;
      })
      .selectAll('rect')
        .data(stamp => stamp)
        .enter()
        .append('rect')
          .attr('x', '0')
          .attr('y', stamp => this.daySizeWithSpace * stamp.day)
          .attr('width', this.daySize)
          .attr('height', this.daySize)
          .attr('fill', stamp => (
            stamp.count !== 0 ? this.color(Math.min(stamp.count, 40)) : '#ededed'
          ))
          .attr('title', stamp => formatTooltipText(stamp))
          .attr('class', 'user-contrib-cell js-tooltip')
          .attr('data-container', 'body')
          .on('click', this.clickDay);
  }

  renderDayTitles() {
    const days = [
      {
        text: 'M',
        y: 29 + (this.daySizeWithSpace * 1),
      }, {
        text: 'W',
        y: 29 + (this.daySizeWithSpace * 3),
      }, {
        text: 'F',
        y: 29 + (this.daySizeWithSpace * 5),
      },
    ];
    this.svg.append('g')
      .selectAll('text')
        .data(days)
        .enter()
        .append('text')
          .attr('text-anchor', 'middle')
          .attr('x', 8)
          .attr('y', day => day.y)
          .text(day => day.text)
          .attr('class', 'user-contrib-text');
  }

  renderMonths() {
    this.svg.append('g')
      .attr('direction', 'ltr')
      .selectAll('text')
        .data(this.months)
        .enter()
        .append('text')
          .attr('x', date => date.x)
          .attr('y', 10)
          .attr('class', 'user-contrib-text')
          .text(date => this.monthNames[date.month]);
  }

  renderKey() {
    const keyValues = ['no contributions', '1-9 contributions', '10-19 contributions', '20-29 contributions', '30+ contributions'];
    const keyColors = ['#ededed', this.colorKey(0), this.colorKey(1), this.colorKey(2), this.colorKey(3)];

    this.svg.append('g')
      .attr('transform', `translate(18, ${(this.daySizeWithSpace * 8) + 16})`)
      .selectAll('rect')
        .data(keyColors)
        .enter()
        .append('rect')
          .attr('width', this.daySize)
          .attr('height', this.daySize)
          .attr('x', (color, i) => this.daySizeWithSpace * i)
          .attr('y', 0)
          .attr('fill', color => color)
          .attr('class', 'js-tooltip')
          .attr('title', (color, i) => keyValues[i])
          .attr('data-container', 'body');
  }

  initColor() {
    const colorRange = ['#ededed', this.colorKey(0), this.colorKey(1), this.colorKey(2), this.colorKey(3)];
    return __WEBPACK_IMPORTED_MODULE_1_d3___default.a.scale.threshold().domain([0, 10, 20, 30]).range(colorRange);
  }

  clickDay(stamp) {
    if (this.currentSelectedDate !== stamp.date) {
      this.currentSelectedDate = stamp.date;

      const date = [
        this.currentSelectedDate.getFullYear(),
        this.currentSelectedDate.getMonth() + 1,
        this.currentSelectedDate.getDate(),
      ].join('-');

      $.ajax({
        url: this.calendarActivitiesPath,
        data: { date },
        cache: false,
        dataType: 'html',
        beforeSend: () => $('.user-calendar-activities').html(LOADING_HTML),
        success: data => $('.user-calendar-activities').html(data),
      });
    } else {
      this.currentSelectedDate = '';
      $('.user-calendar-activities').html('');
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ActivityCalendar;



/***/ }),

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__activity_calendar__ = __webpack_require__(200);


/**
 * UserTabs
 *
 * Handles persisting and restoring the current tab selection and lazily-loading
 * content on the Users#show page.
 *
 * ### Example Markup
 *
 * <ul class="nav-links">
 *   <li class="activity-tab active">
 *     <a data-action="activity" data-target="#activity" data-toggle="tab" href="/u/username">
 *       Activity
 *     </a>
 *   </li>
 *   <li class="groups-tab">
 *     <a data-action="groups" data-target="#groups" data-toggle="tab" href="/u/username/groups">
 *       Groups
 *     </a>
 *   </li>
 *   <li class="contributed-tab">
 *     ...
 *   </li>
 *   <li class="projects-tab">
 *     ...
 *   </li>
 *   <li class="snippets-tab">
 *     ...
 *   </li>
 * </ul>
 *
 * <div class="tab-content">
 *   <div class="tab-pane" id="activity">
 *     Activity Content
 *   </div>
 *   <div class="tab-pane" id="groups">
 *     Groups Content
 *   </div>
 *   <div class="tab-pane" id="contributed">
 *     Contributed projects content
 *   </div>
 *   <div class="tab-pane" id="projects">
 *    Projects content
 *   </div>
 *   <div class="tab-pane" id="snippets">
 *     Snippets content
 *   </div>
 * </div>
 *
 * <div class="loading-status">
 *   <div class="loading">
 *     Loading Animation
 *   </div>
 * </div>
 */

const CALENDAR_TEMPLATE = `
  <div class="clearfix calendar">
    <div class="js-contrib-calendar"></div>
    <div class="calendar-hint">
      Summary of issues, merge requests, push events, and comments
    </div>
  </div>
`;

class UserTabs {
  constructor({ defaultAction, action, parentEl }) {
    this.loaded = {};
    this.defaultAction = defaultAction || 'activity';
    this.action = action || this.defaultAction;
    this.$parentEl = $(parentEl) || $(document);
    this.windowLocation = window.location;
    this.$parentEl.find('.nav-links a')
      .each((i, navLink) => {
        this.loaded[$(navLink).attr('data-action')] = false;
      });
    this.actions = Object.keys(this.loaded);
    this.bindEvents();

    if (this.action === 'show') {
      this.action = this.defaultAction;
    }

    this.activateTab(this.action);
  }

  bindEvents() {
    this.$parentEl
      .off('shown.bs.tab', '.nav-links a[data-toggle="tab"]')
      .on('shown.bs.tab', '.nav-links a[data-toggle="tab"]', event => this.tabShown(event))
      .on('click', '.gl-pagination a', event => this.changeProjectsPage(event));
  }

  changeProjectsPage(e) {
    e.preventDefault();

    $('.tab-pane.active').empty();
    const endpoint = $(e.target).attr('href');
    this.loadTab(this.getCurrentAction(), endpoint);
  }

  tabShown(event) {
    const $target = $(event.target);
    const action = $target.data('action');
    const source = $target.attr('href');
    const endpoint = $target.data('endpoint');
    this.setTab(action, endpoint);
    return this.setCurrentAction(source);
  }

  activateTab(action) {
    return this.$parentEl.find(`.nav-links .js-${action}-tab a`)
      .tab('show');
  }

  setTab(action, endpoint) {
    if (this.loaded[action]) {
      return;
    }
    if (action === 'activity') {
      this.loadActivities();
    }

    const loadableActions = ['groups', 'contributed', 'projects', 'snippets'];
    if (loadableActions.indexOf(action) > -1) {
      this.loadTab(action, endpoint);
    }
  }

  loadTab(action, endpoint) {
    return $.ajax({
      beforeSend: () => this.toggleLoading(true),
      complete: () => this.toggleLoading(false),
      dataType: 'json',
      url: endpoint,
      success: (data) => {
        const tabSelector = `div#${action}`;
        this.$parentEl.find(tabSelector).html(data.html);
        this.loaded[action] = true;
        gl.utils.localTimeAgo($('.js-timeago', tabSelector));
      },
    });
  }

  loadActivities() {
    if (this.loaded.activity) {
      return;
    }
    const $calendarWrap = this.$parentEl.find('.user-calendar');
    const calendarPath = $calendarWrap.data('calendarPath');
    const calendarActivitiesPath = $calendarWrap.data('calendarActivitiesPath');
    const utcOffset = $calendarWrap.data('utcOffset');
    let utcFormatted = 'UTC';
    if (utcOffset !== 0) {
      utcFormatted = `UTC${utcOffset > 0 ? '+' : ''}${(utcOffset / 3600)}`;
    }

    $.ajax({
      dataType: 'json',
      url: calendarPath,
      success: (activityData) => {
        $calendarWrap.html(CALENDAR_TEMPLATE);
        $calendarWrap.find('.calendar-hint').append(`(Timezone: ${utcFormatted})`);

        // eslint-disable-next-line no-new
        new __WEBPACK_IMPORTED_MODULE_0__activity_calendar__["a" /* default */]('.js-contrib-calendar', activityData, calendarActivitiesPath, utcOffset);
      },
    });

    // eslint-disable-next-line no-new
    new gl.Activities();
    this.loaded.activity = true;
  }

  toggleLoading(status) {
    return this.$parentEl.find('.loading-status .loading')
      .toggle(status);
  }

  setCurrentAction(source) {
    let newState = source;
    newState = newState.replace(/\/+$/, '');
    newState += this.windowLocation.search + this.windowLocation.hash;
    history.replaceState({
      url: newState,
    }, document.title, newState);
    return newState;
  }

  getCurrentAction() {
    return this.$parentEl.find('.nav-links .active a').data('action');
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = UserTabs;



/***/ })

});