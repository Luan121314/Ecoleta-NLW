import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'
import './styles.css';
import logo from '../../assets/logo.svg'
import { Map, TileLayer, Marker } from 'react-leaflet'
import api from '../../services/api'
import axios from 'axios'
import { LeafletMouseEvent } from 'leaflet';
import Dropzone from '../../components/Dropzone/index';


const Createpoint = () => {

    // const fav = new Favicon
    // fav.

    interface Item {
        id: number,
        title: string,
        image_url: string
    }

    interface IBGEUFResponse {
        sigla: string
    }

    interface IBGECityResponse {
        nome: string
    }

    const [items, setitems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [selectItems, setSelectItems] = useState<number[]>([])
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })

    const history = useHistory();

    const [selectUf, setSelectUf] = useState('0');
    const [selectCity, setSelectCity] = useState('0');
    const [selectPosition, setSelectPosition] = useState<[number, number]>([0, 0]);
    const [selectedFile, setSelectedFile] = useState<File>();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude])
            setSelectPosition([latitude, longitude])
        })
    }, [])

    useEffect(() => {
        api.get('items').then((response) => {
            setitems(response.data)
        })
    }, [])

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/')
            .then(response => {
                const intials = response.data.map(uf => uf.sigla)
                setUfs(intials)
            })
    }, []);

    useEffect(() => {
        if (selectUf === '0') return;
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome);
                setCities(cityNames)
            })
        // console.log('mudou')
    }, [selectUf]);

    function hanldleSelectUF(event: ChangeEvent<HTMLSelectElement>) {

        const uf = event.target.value
        setSelectUf(uf)
    }

    function hanldleSelectCity(event: ChangeEvent<HTMLSelectElement>) {

        const city = event.target.value
        setSelectCity(city)
    }

    function handleMapClick(event: LeafletMouseEvent) {
        console.log(event.latlng)
        setSelectPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }
    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });

    }
    function handleSelectItem(id: number) {
        const alreadSelected = selectItems.findIndex(item => item === id);
        if (alreadSelected >= 0) {
            const filteredItems = selectItems.filter(item => item !== id);
            setSelectItems(filteredItems)
        } else {
            setSelectItems([...selectItems, id])
        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        console.log(selectedFile);
    

        const { name, whatsapp, email } = formData;
        const uf = selectUf;
        const city = selectCity;
        const [latitude, longitude] = selectPosition;
        const items = selectItems;

        const data = new FormData()
            data.append('name',name)
            data.append('whatsapp',whatsapp)
            data.append('email',email)
            data.append('city',city)
            data.append('uf',uf)
            data.append('latitude',String(latitude))
            data.append('longitude',String(longitude))
            data.append('items',items.join(','))
            if(selectedFile){
                data.append('image', selectedFile);
            }

        
        console.log(data)
        await api.post('points', data);
        alert('Ponto criado');
        history.push('/');
    }


    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft />
                     Voltar para Home
                 </Link>
            </header>
            <form onSubmit={handleSubmit} >
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <Dropzone onfileUploaded={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}

                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="tel"
                                name="whatsapp"
                                id="whatsapp"
                                placeholder="11926309412 "
                                onChange={handleInputChange}

                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>
                    <Map center={initialPosition} zoom={15} onclick={handleMapClick} >
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectPosition} />
                    </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select
                                onChange={hanldleSelectUF}
                                id="uf"
                                name="uf"
                                value={selectUf}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade </label>
                            <select
                                name="city"
                                onChange={hanldleSelectCity}
                                value={selectCity}
                                id="city"
                            >
                                <option value="0">Selecione uma Cidade</option>
                                {
                                    cities.map(city => (
                                        <option key={city} value={city}>{city}</option>

                                    ))
                                }
                            </select>
                        </div>
                    </div>

                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Ítems de coleta</h2>
                        <span>Selecion um ou mais ítems abaixo</span>

                    </legend>
                    <ul className="items-grid">{
                        items.map(item => (
                            <li
                                key={item.id}
                                onClick={() => handleSelectItem(item.id)}
                                className={selectItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))
                    }</ul>
                </fieldset>
                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    )
}
export default Createpoint