# greebdc-skynet-frontend

Gree大数据中心 天网系统 前端

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```
```vue
template>
  <li :class="classlist">
    <router-link v-if="to" class="link" :to="to">
      <slot/>
    </router-link>
      <slot v-else/>
  </li>
</template>
```