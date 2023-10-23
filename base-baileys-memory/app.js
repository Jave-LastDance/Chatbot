const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const axios = require('axios'); // Importa la biblioteca axios

const eventosDeportivos = async () => {
    try {
        const response = await axios.get('http://localhost:8081/eventosPUJ/evento/estado/centro/publicado/Deportivo');
        
        if (response.status === 200) {
            const data = response.data;
            const eventosMapeados = data.map(evento => ({
                body: `${evento.name} ${evento.date_start}`
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
    .addAnswer('No hemos sido claros con la información. Por favor, pregunta tu duda.')
 
const flowCAPS = addKeyword(['CAPS', 'cap', 'caps'])
    .addAnswer('Eventos relacionados a CAPS:')
    .addAnswer('1. Evento 1 de CAPS')
    .addAnswer('2. Evento 2 de CAPS')
    .addAnswer('3. Evento 3 de CAPS')

const flowCJFD = addKeyword(['CJFD', 'cjf', 'cjfd'])
    .addAnswer('Eventos relacionados al Centro Javeriano de Formación Deportiva:', null,async(ctx,{flowDynamic}) => {
        try {
            const data = await eventosDeportivos();
            const eventosMessage = data.map(evento => evento.body).join('\n'); // Concatena los cuerpos de los eventos
            // Usa flowDynamic para mostrar los eventos en el chatbot
            flowDynamic(eventosMessage);
        } catch (error) {
            console.error('Error al obtener o mostrar los eventos:', error);
            // Manejo de error en caso de fallo en la solicitud o en el mapeo
            flowDynamic('Ocurrió un error al obtener los eventos. Por favor, intenta nuevamente más tarde.');
        }
    })
    .addAnswer(['Escribe Duda si no te quedó clara la informacion'],null,null,[flowDuda])


const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('Hola bienvenido a el *Chatbot de BEU*')
    .addAnswer(
        [
            'En este chat podras encontrar más información acerca de los diferentes eventos reportados en nuestra APP',
            'Por favor escribe alguna de las siguientes opciones:',
            '👉 *CAPS* para ver informacion de eventos relacionados a CAPS',
            '👉 *CJFD* para ver eventos relacionados por el Centro Javeriano de Formación Deportiva',
            '👉 *Duda* en caso de no haber sidos claros con la informacion ',
        ],
        null,
        null,
        [flowCAPS, flowCJFD, flowDuda]
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
