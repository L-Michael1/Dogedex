import './App.css';
import { useState, useEffect } from 'react'
import { CircularProgress } from '@mui/material'
import styled from 'styled-components'
import * as ml5 from 'ml5'
import Particles from "react-particles-js"

const initialState = {
  res: null,
  imageUrl: '',
  isLoading: false,

}

const modelLoaded = () => {
  console.log('Model Loaded!')
}

const App = () => {

  const [state, setState] = useState(initialState);
  let imagePreview = null;

  const modelLoaded = () => {
    console.log('Model Loaded!');
  }

  const classifyUpload = () => {
    setState({ ...state, isLoading: true })
    const classifier = ml5.imageClassifier('MobileNet', modelLoaded);
    const image = document.getElementById('uploadedImg');
    classifier.predict(image, 3, (err, results) => {
      console.log(results);
    }).then((results) => {
      setState({ ...state, res: results, isLoading: false })
    }).then((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    if (state.imageUrl !== '') {
      classifyUpload();
    }
  }, [state.imageUrl])

  const handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    if (e.target.files.length > 0) {
      let file = e.target.files[0];
      reader.onloadend = () => {
        setState({ imageUrl: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Container>
      <Particles />
      <Header>
        DogDex
      </Header>
      <Description>
        Dog Breed Detector!
      </Description>
      <ImageInput type="file" onChange={(event) => handleImageChange(event)} />
      {state.imageUrl
        ?
        <Image id="uploadedImg" src={state.imageUrl} />
        :
        <Description>Upload an image!</Description>
      }
      {state.isLoading
        ?
        <Container>
          <Header>Detecting...</Header>
          <CircularProgress size={130} color='success' />
        </Container>
        :
        state.res
          ?
          <ResultsContainer>
            {state.res.map((result) => {
              const label = result.label;
              const capLabel = label.charAt(0).toUpperCase() + label.slice(1);
              const percentConfidence = result.confidence * 100;
              const confidence = Number.parseFloat(percentConfidence).toPrecision(3);
              return (
                <Result>
                  <Label>
                    {capLabel}
                  </Label>
                  <h4>
                    Confidence {confidence}%
                  </h4>
                </Result>
              )
            })}
          </ResultsContainer>
          :
          null
      }
    </Container>
  );
}

const Container = styled.div`
  max-width: 1280px;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Header = styled.h1`
  font-size: 2.5rem;
  color: #52b788;
  text-decoration: underline;
`

const Description = styled.p`
  margin-top: 2rem;
  font-size: 1.5rem;
  color: #74c69d;
`

const ImageInput = styled.input`
  color: #FFFFFF;
  margin-top: 2rem;
  margin-left: 6rem;
`

const Image = styled.img`
  max-width: 540px;
  max-height: 540px;
`

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const Result = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 1rem;
`

const Label = styled.h2`
  color: #52b788;
`

export default App;
