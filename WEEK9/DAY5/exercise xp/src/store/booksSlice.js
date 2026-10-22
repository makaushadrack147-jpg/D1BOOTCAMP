import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  books: [
    {
      id: 1,
      title: 'The Haunting of Hill House',
      author: 'Shirley Jackson',
      genre: 'Horror',
      accent: 'plum',
    },
    {
      id: 2,
      title: 'Mexican Gothic',
      author: 'Silvia Moreno-Garcia',
      genre: 'Horror',
      accent: 'rose',
    },
    {
      id: 3,
      title: 'The Hobbit',
      author: 'J. R. R. Tolkien',
      genre: 'Fantasy',
      accent: 'moss',
    },
    {
      id: 4,
      title: 'A Wizard of Earthsea',
      author: 'Ursula K. Le Guin',
      genre: 'Fantasy',
      accent: 'gold',
    },
    {
      id: 5,
      title: 'Dune',
      author: 'Frank Herbert',
      genre: 'Science Fiction',
      accent: 'sand',
    },
    {
      id: 6,
      title: 'Kindred',
      author: 'Octavia E. Butler',
      genre: 'Science Fiction',
      accent: 'blue',
    },
  ],
}

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
})

export default booksSlice.reducer
