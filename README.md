# Vue Spectre
Spectre.css components and plugins for VueJS

## Installation

### npm

```bash
$ npm i -S @devindex/vue-spectre
```
  
### yarn

```bash
$ yarn add @devindex/vue-spectre
```

### Usage

```javascript
import Vue from 'vue'
import VueSpectre from '@devindex/vue-spectre'

/** Activate plugin **/
Vue.use(VueSpectre);
```

## Components

### Autocomplete

```html
<dx-autocomplete
    v-model="value"
    :source="source"
    label="name"
    track-by="id">
</dx-autocomplete>
```

| Property name | Type | Default | Required |
| ------------- | ---- | ------- | -------- |
| source | Function\|Array |  | true |
| label | String |  | true (when source is an array of objects) |
| track-by | String | | true (when source is an array of objects) |
| placeholder | String | `''` | false |
| custom-label | Function |  | false |
| debounce | Number | `300` | false |
| min-len | Number | `3` | false |
| input-class | String | `''` | false |
| input-id | String | `''` | false |
| highlight | Boolean | `false` | false |
| disabled | Boolean | `false` | false |
| readonly | Boolean | `false` | false |
| loading | Boolean | `false` | false |

| Event name | Attributes |
| ---------- | ------ |
| select | `(value)` |
| focus | `(search)` |
| blur | `(search)` |

### Calendar

```html
<dx-calendar v-model="date" />
```

| Property name | Type | Default | Required |
| ------------- | ---- | ------- | -------- |
| min | Date | `null` | false |
| max | Date | `null` | false |
| highlights | Array | `[]` | false |

| Event name | Attributes |
| ---------- | ------ |
| select | `(value)` |
| prev | `()` |
| next | `()` |
| month-change | `()` |

| Slots |
| ---------- |
| prev-nav |
| next-nav |

### Dropdown

```html
<dx-dropdown
    :items="[]"
    label="name"
    @select="onSelect">
    Dropdown
</dx-dropdown>
```

| Property name | Type | Default | Required |
| ------------- | ---- | ------- | -------- |
| items | Array |  | true |
| label | String |  | true (when item is an array of objects) |
| max-height | Number | 300 | false |
| direction | String | left | false |
| disabled | Boolean | false | false |

| Event name | Attributes |
| ---------- | ------ |
| select | `(value)` |

### Inputs

Input date
```html
<dx-input-date v-model="date" />
```

Input number
```html
<dx-input-number v-model="number" :precision="2" />
```

### Modal

```html
<dx-modal
    v-model="show"
    title="Modal">
    ...
</dx-modal>
```

| Property name | Type | Default | Required |
| ------------- | ---- | ------- | -------- |
| title | String |  | false |
| closable | Boolean | `true` | false |
| size | String |  | false |
| click-to-close | Boolean | `false` | false |

### Pagination

```html
<dx-pagination
    :total="total"
    :limit="limit"
    @paginate="onPaginate"

    :numbers="numbers"/>
</dx-pagination>
```

### Tabs

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
