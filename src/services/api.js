import axios from 'axios';

// Chave da API OpenWeatherMap
const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Configuração padrão para as requisições
const api = axios.create({
    baseURL: BASE_URL,
    params: {
        appid: API_KEY,
        units: 'metric', // Usar unidades métricas (Celsius)
        lang: 'pt_br', // Resultados em português do Brasil
    },
});

// Função para buscar clima atual por nome da cidade
export const fetchWeatherByCity = async (city) => {
    try {
        const response = await api.get('/weather', {
            params: {
                q: city,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Função para buscar clima atual por coordenadas geográficas
export const fetchWeatherByCoords = async (lat, lon) => {
    try {
        const response = await api.get('/weather', {
            params: {
                lat,
                lon,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Função para buscar previsão de 5 dias por coordenadas
export const fetchForecast = async (lat, lon) => {
    try {
        const response = await api.get('/forecast', {
            params: {
                lat,
                lon,
            },
        });

        // Processar os dados para facilitar a exibição
        const processedData = processForecastData(response.data);
        return processedData;
    } catch (error) {
        throw error;
    }
};

// Função auxiliar para processar dados da previsão
const processForecastData = (data) => {
    // Agrupar previsões por dia
    const forecastByDay = {};

    data.list.forEach((item) => {
        // Converter timestamp para objeto Date
        const date = new Date(item.dt * 1000);

        // Obter a data no formato YYYY-MM-DD (sem horas)
        const dayKey = date.toISOString().split('T')[0];

        // Se ainda não houver um grupo para este dia, criar um
        if (!forecastByDay[dayKey]) {
            forecastByDay[dayKey] = {
                date: dayKey,
                day: new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date),
                items: [],
            };
        }

        // Adicionar este item ao grupo do dia correspondente
        forecastByDay[dayKey].items.push({
            time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            temp: item.main.temp,
            feels_like: item.main.feels_like,
            humidity: item.main.humidity,
            weather: item.weather[0],
            wind_speed: item.wind.speed,
            clouds: item.clouds.all,
            dt: item.dt,
        });
    });

    // Converter para array e adicionar dados calculados
    const processedForecast = Object.values(forecastByDay).map((day) => {
        // Calcular temperaturas min/max/média do dia
        const temps = day.items.map((item) => item.temp);
        day.temp_min = Math.min(...temps);
        day.temp_max = Math.max(...temps);
        day.temp_avg = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;

        // Determinar o ícone e descrição principal para o dia
        // (usando o registro do meio do dia quando possível)
        const middayItem = day.items.find((item) => {
            const hour = new Date(item.dt * 1000).getHours();
            return hour >= 11 && hour <= 13;
        }) || day.items[0];

        day.weather = middayItem.weather;

        return day;
    });

    // Limitar para 5 dias
    return processedForecast.slice(0, 5);
};