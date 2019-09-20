# 数字と手紙 (Sūji to tegami)

## Introducción

Para este primer **Code Dojo** he pensado en proponeros con un **Kumite** legendario.

La mecánica del enfrentamiento está fuertemente inspirada en un reto tradicional de nuestra cultura que ha venido celebrándose durante generaciones.

Estoy hablando efectivamente de **Cifras y Letras**.

Los participantes en este **Kumite** se dividirán en dos equipos liderados por dos **arquitectos**.

Cada uno de los arquitectos coordinará un equipo de desarrollo.

Una vez elegidos los **arquitectos** (se solicitarán voluntarios y en su defecto se elegirán a dedo), se pasará a elegir de entre los participantes (de forma alterna) al equipo de cada uno (teniendo en cuenta los skills necesarios para enfrentar el reto).

## Normas generales

- Cada equipo trabajará en una rama del proyecto
- El código se escribirá íntegramente en **TypeScript** (por tercera vez en mi vida quiero un hijo de [Anders Hejlsberg](https://es.wikipedia.org/wiki/Anders_Hejlsberg))
- Deberá de pasar el lintado de código al 100%
- El desarrollo se realizará mediante **TDD** (test driven development) con **jest**
- Al final del mismo la cobertera de los test sólo dejará de lado aquellas ramificaciones que por su naturaleza no tenga sentido verificar.
- El arquitecto solo puede coordinar al equipo, no puede escribir código.
- Todos los miembros del equipo deben de haber escrito al menos un módulo del proyecto.
- El equipo se dividirá en 3 grupos:
  - Comunicaciones
  - Cifras
  - Letras
- El código de cada equipo se preparará de forma colaborativa a tiempo real empleando **Live Share** (recomiendo el emplear el extension pack https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare-pack) sobre el entorno del **arquitecto**

## Mecánica

### Formato general (Tradicional)

Pruebas en el siguiente orden:

Cifras - Letras - Letras - Cifras - Letras - Letras - Cifras - Letras - Letras - Cifras

En las cifras, el acertante de un número exacto es premiado con 8 puntos. Si no había número exacto, quien se aproximara más recibía 6 puntos.

En las letras, el ganador obtendrá tantos puntos como letras tiene su palabra.

La palabra tiene que aparecer en el diccionario de la RAE.

En caso de error por parte del concursante, los puntos que habría obtenido se adjudicaban directamente a su adversario.

### Cifras

El objetivo es obtener, en 1 segundo, un número entero natural (del 101 al 999) con las operaciones aritméticas elementales (+,−,×,÷) con seis números (del 1 al 10, 25, 50, 75 y 100). No es obligatorio usar todos los números, pero no se puede repetir ninguno. Gana la prueba el jugador que dé con el número exacto.

Si ninguno lo consigue, gana el que se aproxime más. En caso de empate, se adjudican al que menos tiempo tarde en dar la respuesta.

### Letras

Los concursantes piden, alternativamente, vocal o consonante, hasta un total de nueve letras, con las que deben formar, en 1 segundo, la palabra más larga posible sin usar ninguna letra más de una vez. Son válidas las palabras recogidas en el Diccionario de la Real Academia Española.
No son válidos los plurales, ni las formas personales del verbo.
Sí son válidos los femeninos y las formas no personales (infinitivo, participio y gerundio) de los verbos. Gana el concursante que consigue la palabra más larga.
En caso de empate, gana el programa que enviase su respuesta antes.

## Elisenda

Es el "presentador" en forma de servidor socket que se encargará de coordinar el programa.

Emitirá los siguientes mensajes:

- ciphers
- letters

### ciphers

Junto con este mensaje se enviará un objeto con la siguiente información:

```javascript
{
  transaction: '872346827', // Código único de transacción
  ciphers: [1,9,25,6,7,100], // 6 cifras aleatorias tomadas de el conjunto 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 75 y 100
  expectedResult: 191, // Valor aleatorio entre 101 y 999
}
```

Como resultado deberemos emitir una respuesta con mensaje igual al código de transacción y como valor un string con la expresión.

#### Ejemplo respuesta cifras

```javascript
socket.emit('872346827', '(1 + 7) * 25 - 9')
```

> La cadena solo puede contener, los números entregados por el servidor, símbolos del conjunto **'+', '-', '*', '%', '(' o ')'** y espacios.

Elisenda evaluará la cadena mediante el método **eval** trás verificar que solo contiene lo que se espera.

### letters

Junto con este mensaje se enviará un objeto con la siguiente información:

```javascript
{
  transaction: '3459873478', //Código único de transacción
  letters: ['a','c','e','i','t','r','n','u','o'], // 9 Letras aleatorias a emplear
  
}
```

Como resultado deberemos emitir una respuesta con mensaje igual al código de transacción y como valor un string con la palabra encontrada.

#### Ejemplo respuesta letras

```javascript
socket.emit('3459873478', 'cuaternio')
```

Adicionalmente dispondrá de la opción de solicitar un test de cualquier de los dos ejercicios:

- Para cifras:

```javascript
socket.emit('test', 'ciphers')
```

- Para letras:

```javascript
socket.emit('test', 'letters')
```

## Otros comandos

Elisenda también admite el comando test para testear las comunicaciones:

```javascript
socket.emit('check', '1234234234');
```

Que retornará un mensaje '1234234234' con valor {ok: true, d: 'pong'}.

Y un comando de login para establecer el nombre del equipo.

```javascript
socket.emit('login', '345345454354', 'Unicorns Of Love');
```

Que retornará un mensaje '1234234234' con valor ```{ok: true, d: null}```.

> **Nota**: En caso de que cualquier comando retorne un error lo hará devolviendo un objeto con la estructura ```{ok: false, e: err.message, stack: err.stack }```

## Conexión

Elisenda estará corriendo en [http://192.168.1.19:9230/ws](http://192.168.1.19:9230/ws)
