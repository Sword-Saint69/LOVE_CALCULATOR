<script setup lang="ts">
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const items = ref<any[]>([]);

const fetchData = async () => {
  const querySnapshot = await getDocs(collection(db, "love_calculations"));
  items.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

onMounted(fetchData);
</script>

<template>
  <div>
    <h2>Firestore Data</h2>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item }}
      </li>
    </ul>
  </div>
</template>
