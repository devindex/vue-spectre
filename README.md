# vue-spectre
Spectre.css components and plugins for VueJS

## Installation

NPM

  `npm i -S @devindex/vue-spectre`
  
Yarn

  `yarn add @devindex/vue-spectre`

## Usage

```javascript
import Vue from 'vue'
import VueSpectre from '@devindex/vue-spectre'

/** Activate plugin **/
Vue.use(VueSpectre);
```

## Components

### dx-autocomplete

```html
<dx-autocomplete
    v-model="value"
    :source="source"
    label="name"
    track-by="code"

    placeholder="..."
    :custon-label="customLabelFn"
    :debounce="300"
    :min-len="3"
    :input-class="custom-ac-input-class"
    :input-id="custom-ac-input-id"
    :highlight="false"
    :disabled="false"
    :loading="false"
    :max-height="300"
    @select="onSelect"
    @focus="onFocus"
    @blur="onBlur">
</dx-autocomplete>
```

### dx-calendar

```html
<dx-calendar
    :date="date"
    @select="onSelect"

    :min="minDate"
    :max="maxDate"    
    :highlights="[]"
    @next="onNextMonth"
    @prev="onPrevMonth"
    @month-change="onMonthChange">
</dx-calendar>
```

### dx-modal

```html
<dx-modal
    :show="show"
    title="Modal"
    @close="show = false"

    :closable="true"
    size="md">
</dx-modal>
```

### dx-pagination

```html
<dx-pagination
    :total="total"
    :limit="limit"
    @paginate="onPaginate"

    :numbers="numbers"/>
</dx-pagination>
```

### dx-tabs

```html
<dx-tabs 
    :block="false" 
    @change="onChange">
    <dx-tab 
        name="Tab 1"
        id="custom-id-1">
        Tab content 1
    </dx-tab>
    <dx-tab name="Tab 2" id="custom-id-2">
        Tab content 2
    </dx-tab>
</dx-tabs>
```

## License

Released under the [MIT License](./LICENSE).
