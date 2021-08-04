# Vue Spectre
Spectre.css components and plugins for Vue 3

## Installation

### Add package

```bash
# npm
$ npm i -S @devindex/vue-spectre

# yarn
$ yarn add @devindex/vue-spectre
```

### Usage

```javascript
import { createApp } from 'vue';
import VueSpectre from '@devindex/vue-spectre'; // <-- ADD THIS LINE
import App from './App.vue';

const app = createApp(App);

app.use(VueSpectre, { locale: 'en' });  // <-- ADD THIS LINE

app.mount('#app');
```

## Components

### Autocomplete

```html
<dx-autocomplete
    v-model="value"
    :source="source"
    label="name"
    track-by="id"
></dx-autocomplete>
```

#### Properties

| Name | Type | Default | Required |
| ---- | ---- | ------- | -------- |
| source | Function,Array |  | true |
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

#### Events

| Name | Args |
| ---- | ---- |
| select | `(value)` |
| focus | `(search)` |
| blur | `(search)` |

### Calendar

```html
<dx-calendar v-model="date"></dx-calendar>
```

#### Properties

| Name | Type | Default | Required |
| ---- | ---- | ------- | -------- |
| min | Date | `null` | false |
| max | Date | `null` | false |
| highlights | Array | `[]` | false |

#### Events

| Name | Args |
| ---- | ---- |
| select | `(value)` |
| prev | `()` |
| next | `()` |
| month-change | `()` |

#### Slots

`prev-nav`, `next-nav`

### Dropdown

```html
<dx-dropdown
    :items="[]"
    label="name"
    @select="onSelect"
>Dropdown</dx-dropdown>
```

#### Properties

| Name | Type | Default | Required |
| ---- | ---- | ------- | -------- |
| items | Array |  | true |
| label | String |  | true (when item is an array of objects) |
| max-height | Number | 300 | false |
| direction | String | left | false |
| disabled | Boolean | false | false |

#### Events

| Name | Args |
| ---- | ---- |
| select | `(value)` |

### Inputs

Input date
```html
<dx-input-date v-model="date"></dx-input-date>
```

Input number
```html
<dx-input-number v-model="number" :precision="2"></dx-input-number>
```

### Modal

```html
<dx-modal
    v-model="show"
    title="Modal"
>Modal content</dx-modal>
```

#### Properties

| Name | Type | Default | Required |
| ---- | ---- | ------- | -------- |
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
    :numbers="numbers"
></dx-pagination>
```

#### Properties

| Name | Type | Default | Required |
| ---- | ---- | ------- | -------- |
| total | number | `0` | false |
| limit | number | `20` | false |
| numbers | number | `11` | false |

#### Events

| Name | Args |
| ---- | ---- |
| paginate | `({ total, limit, offset, pages, page })` |

### Tabs

```html
<dx-tabs :block="false" @change="onChange">
    <dx-tab name="Tab 1" id="custom-id-1">
        Tab content 1
    </dx-tab>
    <dx-tab name="Tab 2" id="custom-id-2">
        Tab content 2
    </dx-tab>
</dx-tabs>
```

#### Properties - dx-tabs

| Name | Type | Default | Required |
| ---- | ---- | ------- | -------- |
| block | boolean | `false` | false |

#### Events - dx-tabs

| Name | Args |
| ---- | ---- |
| change | `({ tab })` |

#### Slots - dx-tabs

`action`

#### Properties - dx-tab

| Name | Type | Default | Required |
| ---- | ---- | ------- | -------- |
| label | string |  | true |
| disabled | boolean | `false` | false |


## License

Released under the [MIT License](./LICENSE).
