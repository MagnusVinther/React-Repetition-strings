import axios from 'axios'
import { useEffect, useState } from 'react'
import { useAuth } from '../../App/Auth/Auth'
import { AiOutlineHeart } from 'react-icons/ai'
import Styles from './FavoriteButton.module.scss'

const FavoriteButton = ({ product_id }) => {
	const { loginData } = useAuth()
	const [ isFavorite, setIsFavorite ] = useState(false)
	const [ myFavorites, setMyFavorites ] = useState([])

	/**
	 * Object var til api info
	 */
	const api_info = {
		endpoint: 'https://api.mediehuset.net/snippets/favorites',
		options: { headers: {
			Authorization: `Bearer ${loginData.access_token}`
		}}
	}

	/**
	 * UseEffect Hook til styring af liste over favoritter
	 */
	useEffect(() => {
		const getFavorites = async () => {
			const result = await axios.get(api_info.endpoint, api_info.options)
			if(result.data.items) {
				setMyFavorites(result.data.items)
			}
		}
		getFavorites()
	}, [api_info.endpoint, api_info.options, loginData.access_token])

	/**
	 * UseEffect Hook til styring af favorit status ud fra product_id
	 */
	useEffect(() => {
		setIsFavorite(myFavorites.some(elm => elm.product_id === product_id))
	},[myFavorites, product_id])

	/**
	 * Tilføj favorit
	 */
	const addFavorite = async () => {
		setIsFavorite(true)

		const formData = new FormData();
		formData.append('product_id',product_id)
		await axios.post(api_info.endpoint, formData, api_info.options)		
	}

	/**
	 * Fjern favorit
	 */
	const removeFavorite = async () => {
		setIsFavorite(false)

		await axios.delete(`${api_info.endpoint}/${product_id}`, api_info.options)
	}

	return (
		<button 
			onClick={!isFavorite ? addFavorite : removeFavorite} 
			className={isFavorite ? `${Styles.button} ${Styles.active}` : Styles.button}>
			<AiOutlineHeart />
		</button>
	);
}

export default FavoriteButton;
