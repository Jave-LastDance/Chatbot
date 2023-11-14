const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const axios = require('axios'); // Importa la biblioteca axios



const eventosDB = async (endpoint) => {
    try {
        const response = await axios.get(`http://190.156.243.87:8888/eventosPUJ/evento/${endpoint}`);
        
        if (response.status === 200) {
            const data = response.data;
            const eventosMapeados = data.map(evento => ({
                body: `${evento.name}\nDia:${evento.date_start}\nHora: ${evento.time_start}\n\n${evento.description}\n\nMas información en: ${evento.url_event} `,
                media: evento.url_poster
            }));
            
            return eventosMapeados;
        } else {
            throw new Error(`La solicitud al servidor devolvió un estado ${response.status}`);
        }
    } catch (error) {
        throw new Error(`Error al obtener los eventos: ${error.message}`);
    }
};

const flowDuda = addKeyword(['Duda', 'duda', 'dudas'])
    .addAnswer('En caso de tener dudas puedes comunicarte al correo *vicemed@javeriana.edu.co* especificando toda la informacion acerca de la duda que presentes.')
    .addAnswer('Escribe *Volver* para ir al inicio')


//Psicologia
const flowPsicologia = addKeyword(['Psicologia', 'Salud', '5'])
.addAnswer('Eventos relacionados al Psicologia y Salud:', null,async(ctx,{flowDynamic}) => {
    try {
        const data = await eventosDB('estado/centro/activo/CAPS');
        const eventosMessages = data.map(evento => ({
            body: `${evento.body}`,
            media: `${evento.media}`,
            delay: 1000
        }));

        // Usa flowDynamic para mostrar los eventos en el chatbot
        await flowDynamic(eventosMessages);
       
    } catch (error) {
        console.error('Error al obtener o mostrar los eventos:', error);
        // Manejo de error en caso de fallo en la solicitud o en el mapeo
        flowDynamic('Ocurrió un error al obtener los eventos. Por favor, intenta nuevamente más tarde.');
    }
})
.addAnswer(['Escribe Duda si no te quedó clara la informacion o Volver para ir al inicio'],null,null,[flowDuda])




//Pastoral
const flowPast = addKeyword(['Pastoral', 'past', '4'])
    .addAnswer('Eventos relacionados a Pastoral:', null,async(ctx,{flowDynamic}) => {
        try {
            const data = await eventosDB('estado/centro/activo/CPSFJ');
            const eventosMessages = data.map(evento => ({
                body: `${evento.body}`,
                media: `${evento.media}`,
                delay: 1000
            }));

            // Usa flowDynamic para mostrar los eventos en el chatbot
            await flowDynamic(eventosMessages);
           
        } catch (error) {
            console.error('Error al obtener o mostrar los eventos:', error);
            // Manejo de error en caso de fallo en la solicitud o en el mapeo
            flowDynamic('Ocurrió un error al obtener los eventos. Por favor, intenta nuevamente más tarde.');
        }
    })
    .addAnswer(['Escribe Duda si no te quedó clara la informacion o Volver para ir al inicio'],null,null,[flowDuda])



//Identidad y Comunidad
const flowIdCom = addKeyword(['Identidad', 'Comunidad', '3'])
    .addAnswer('Eventos relacionados a Identidad y Comunidad Javeriana:', null,async(ctx,{flowDynamic}) => {
        try {
            const data = await eventosDB('estado/centro/activo/CFICC');
            const eventosMessages = data.map(evento => ({
                body: `${evento.body}`,
                media: `${evento.media}`,
                delay: 1000
            }));

            // Usa flowDynamic para mostrar los eventos en el chatbot
            await flowDynamic(eventosMessages);
           
        } catch (error) {
            console.error('Error al obtener o mostrar los eventos:', error);
            // Manejo de error en caso de fallo en la solicitud o en el mapeo
            flowDynamic('Ocurrió un error al obtener los eventos. Por favor, intenta nuevamente más tarde.');
        }
    })
    .addAnswer(['Escribe Duda si no te quedó clara la informacion o Volver para ir al inicio'],null,null,[flowDuda])
    


 //CULTURAL
const flowCultural = addKeyword(['Culturales', 'cult', '2'])
.addAnswer('Eventos relacionados a temas Culturales:', null,async(ctx,{flowDynamic}) => {
    try {
        const data = await eventosDB('estado/centro/activo/CGC');
        const eventosMessages = data.map(evento => ({
            body: `${evento.body}`,
            media: `${evento.media}`,
            delay: 1000
        }));

        // Usa flowDynamic para mostrar los eventos en el chatbot
        await flowDynamic(eventosMessages);
       
    } catch (error) {
        console.error('Error al obtener o mostrar los eventos:', error);
        // Manejo de error en caso de fallo en la solicitud o en el mapeo
        flowDynamic('Ocurrió un error al obtener los eventos. Por favor, intenta nuevamente más tarde.');
    }
})
.addAnswer(['Escribe Duda si no te quedó clara la informacion o Volver para ir al inicio'],null,null,[flowDuda])


//CJFD
const flowCJFD = addKeyword(['CJFD', 'cjf', 'cjfd', '1'])
    .addAnswer('Eventos relacionados al Centro Javeriano de Formación Deportiva:', null,async(ctx,{flowDynamic}) => {
        try {
            const data = await eventosDB('estado/centro/activo/CJFD');
            const eventosMessages = data.map(evento => ({
                body: `${evento.body}`,
                media: `${evento.media}`,
                delay: 1000
            }));

            // Usa flowDynamic para mostrar los eventos en el chatbot
            await flowDynamic(eventosMessages);
        } catch (error) {
            console.error('Error al obtener o mostrar los eventos:', error);
            // Manejo de error en caso de fallo en la solicitud o en el mapeo
            flowDynamic('Ocurrió un error al obtener los eventos. Por favor, intenta nuevamente más tarde.');
        }
    })
    .addAnswer(['Escribe Duda si no te quedó clara la informacion o Volver para ir al inicio'],null,null,[flowDuda])


    const flowPrincipal = addKeyword(['hola', 'ole', 'alo', 'volver','Buenas','Buenas tardes','Buenos dias','Buen dia','dia'])
    .addAnswer('Hola bienvenido a el *Chatbot de BEU*')
    .addAnswer(
        [
            'En este chat podras encontrar más información acerca de los diferentes eventos reportados en nuestra APP',
            'Por favor escribe alguna de las siguientes opciones:',
            '👉 *1* para ver informacion de eventos relacionados a el Centro Javeriano de Formación Deportiva',
            '👉 *2* para ver eventos relacionados a temas Culturales',
            '👉 *3* para ver eventos relacionados a Identidad y Comunidad',
            '👉 *4* para ver eventos relacionados a Pastoral',
            '👉 *5* para ver eventos relacionados a Psicologia y Salud',
            '👉 *Duda* en caso de no haber sidos claros con la informacion ',
        ],
        null,
        null,
        [flowCultural, flowCJFD, flowDuda, flowIdCom, flowPsicologia, flowPast]
    )
 

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
