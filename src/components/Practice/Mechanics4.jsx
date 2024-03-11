import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import practicebg from '../../assets/images/practice-bg.svg';
import VoiceAnalyser from '../../utils/VoiceAnalyser';
import MainLayout from '../Layouts.jsx/MainLayout';
import useSound from 'use-sound';
import t from '../../assets/audio/t.mp3';
import i from '../../assets/audio/i.mp3';
import g from '../../assets/audio/g.mp3';
import e from '../../assets/audio/e.mp3';
import r from '../../assets/audio/r.mp3';

const sectionStyle = {
    width: '100%',
    backgroundImage: `url(${practicebg})`,
    backgroundSize: 'cover', // Cover the entire viewport
    backgroundPosition: 'center center', // Center the image
    backgroundRepeat: 'no-repeat', // Do not repeat the image
    height: '100vh',
    padding: '20px 100px',
    boxSizing: 'border-box',
};

const Mechanics4 = ({ page, setPage, setVoiceText, setRecordedAudio, setVoiceAnimate, storyLine, type }) => {
    const [words, setWords] = useState(type == 'char' ? ['G', 'R', 'T', 'I', 'E'] : ['Friend', 'She is', 'My']);
    const [selectedWords, setSelectedWords] = useState([]);

    const [tPlay] = useSound(t);
    const [iPlay] = useSound(i);
    const [gPlay] = useSound(g);
    const [ePlay] = useSound(e);
    const [rPlay] = useSound(r);

    const audioPlay = {
        T: tPlay,
        I: iPlay,
        G: gPlay,
        E: ePlay,
        R: rPlay,
    };
    const handleWords = (word, isSelected) => {
        audioPlay[word]();
        if (isSelected) {
            let selectedWordsArr = [...selectedWords];
            let index = selectedWordsArr?.findIndex((elem) => elem == word);
            selectedWordsArr?.splice(index, 1);
            setSelectedWords(selectedWordsArr);
            setWords([...words, word]);
        } else {
            let wordsArr = [...words];
            let index = wordsArr?.findIndex((elem) => elem == word);
            wordsArr?.splice(index, 1);
            setWords(wordsArr);
            setSelectedWords([...selectedWords, word]);
        }
    };

    return (
        <MainLayout level={1}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, mt: 8 }}>
                <Box
                    sx={{
                        minWidth: '250px',
                        minHeight: '70px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '15px',
                        border: `2px solid ${
                            !words?.length && !!selectedWords?.length && type == 'char'
                                ? '#1897DE'
                                : 'rgba(51, 63, 97, 0.10)'
                        }`,
                        cursor: 'pointer',
                        letterSpacing: '15px',
                        background: '#FBFBFB',
                        paddingX: type == 'char' ? 0 : '20px',
                    }}
                >
                    {selectedWords?.map((elem) => (
                        <span
                            onClick={() => handleWords(elem, true)}
                            style={{
                                color: type == 'char' ? '#1897DE' : '#333F61',
                                fontWeight: type == 'char' ? 600 : 700,
                                fontSize: '40px',
                                fontFamily: 'Quicksand',
                                cursor: 'pointer',
                                marginLeft: type == 'char' ? 0 : '20px',
                            }}
                        >
                            {elem}
                        </span>
                    ))}
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                {words?.map((elem) => (
                    <>
                        {type == 'char' ? (
                            <Box
                                onClick={() => handleWords(elem)}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '60px',
                                    width: '60px',
                                    background: '#1897DE',
                                    m: 1,
                                    cursor: 'pointer',
                                    borderRadius: '12px',
                                    border: '5px solid #10618E',
                                }}
                            >
                                <span
                                    style={{
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '40px',
                                        fontFamily: 'Quicksand',
                                    }}
                                >
                                    {elem}
                                </span>
                            </Box>
                        ) : (
                            <Box
                                onClick={() => handleWords(elem)}
                                sx={{
                                    textAlign: 'center',
                                    px: '25px',
                                    py: '12px',
                                    background: 'transparent',
                                    m: 1,
                                    textTransform: 'none',
                                    borderRadius: '12px',
                                    border: `1px solid rgba(51, 63, 97, 0.10)`,
                                    background: '#FFF',
                                    cursor: 'pointer',
                                }}
                            >
                                <span
                                    style={{
                                        color: '#6F80B1',
                                        fontWeight: 600,
                                        fontSize: '32px',
                                        fontFamily: 'Quicksand',
                                    }}
                                >
                                    {elem}
                                </span>
                            </Box>
                        )}
                    </>
                ))}
            </Box>
            {!words?.length && !!selectedWords?.length && (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <VoiceAnalyser
                        setVoiceText={setVoiceText}
                        setRecordedAudio={setRecordedAudio}
                        setVoiceAnimate={setVoiceAnimate}
                        storyLine={storyLine}
                        dontShowListen={true}
                        // updateStory={updateStory}
                    />
                </Box>
            )}
        </MainLayout>
    );
};

export default Mechanics4;
