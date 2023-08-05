<template>
  <div>
    <div class="flex flex-col md:flex-row">
      <CompBanner title="¡Llega a más clientes con nuestro servicio de Email Marketing!"
        description="Envía correos personalizados y segmentados a tus suscriptores de forma fácil y efectiva."
        link="/productos" buttonText="Productos" imageSrc="img/fondo-home.png" imageAlt="Email Marketing" />

    </div>
    <hr class="my-8 border-gray-300">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="lg:flex lg:justify-between">
        <div class="lg:w-1/2 me-5">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Quiénes somos</h2>
          <p class="mt-4 text-lg text-gray-500">
            Somos una empresa dedicada a brindar soluciones de Email Marketing <span class="font-bold">efectivas</span> y
            <span class="font-bold">personalizadas</span>.
            Nuestra historia se remonta a hace más de una década, cuando un grupo de expertos en marketing digital se unió
            con el objetivo de ayudar a las empresas a alcanzar sus metas de comunicación con sus clientes a través del
            correo electrónico.
          </p>
          <p class="mt-4 text-lg text-gray-500">
            A lo largo de los años, hemos perfeccionado nuestras estrategias y desarrollado herramientas avanzadas que
            permiten
            a nuestros clientes enviar correos electrónicos personalizados y segmentados de manera <span
              class="font-bold">fácil</span> y <span class="font-bold">efectiva</span>.
            Nuestro enfoque se basa en comprender las necesidades y objetivos de cada cliente para brindar soluciones a
            medida
            que generen resultados <span class="font-bold">tangibles</span>.
          </p>
          <p class="mt-4 text-lg text-gray-500">
            Estamos comprometidos con la <span class="font-bold">excelencia</span> en el servicio y nos enorgullece ayudar
            a nuestros clientes a llegar a más
            clientes y aumentar su efectividad en sus campañas de email marketing.
            Trabajamos de la mano con nuestros clientes, ofreciendo asesoramiento personalizado y soporte técnico para
            garantizar
            su éxito en cada paso del camino.
          </p>
        </div>
        <div class="mt-10 lg:mt-0 lg:w-1/2 ms-5">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Clientes</h2>
          <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">

            <div v-for="client in clients" :key="client.id"
              class="bg-white overflow-hidden shadow rounded-lg borderMylogo">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium text-gray-900">{{ client.name }}</h3>
                <p class="mt-1 text-sm text-gray-500">Ubicado en {{ client.location }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CompBanner from "../components/CompBanner.vue";

const clients = [
  {
    id: 1,
    name: 'Restaurante Viva La Pepa',
    location: 'Martinez',
  },
  {
    id: 2,
    name: 'Mayorista del Río',
    location: 'Córdoba',
  },
  {
    id: 3,
    name: 'Textil Del Plata',
    location: 'Gran Buenos Aires',
  },
  {
    id: 4,
    name: 'Vestidos Laura',
    location: 'Ciudad Autónoma de Buenos Aires',
  },
  {
    id: 5,
    name: 'Casa de la Música',
    location: 'Rosario',
  }
];
</script>

