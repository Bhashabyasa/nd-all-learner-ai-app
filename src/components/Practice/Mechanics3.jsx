import { Box, Typography } from '@mui/material';
import React, { createRef, useState } from 'react';
import v11 from '../../assets/audio/V10.mp3';
import {
    AudioBarColoredSvg,
    AudioBarSvg,
    AudioPlayerSvg,
    PlayAudioButton,
    StopAudioButton,
    SubmitButton,
} from '../../utils/constants';
import MainLayout from '../Layouts.jsx/MainLayout';

const Mechanics2 = ({ page, setPage, type }) => {
    const [words, setWords] = useState(['Barking', 'Breaking', 'Scolding']);
    const [sentences, setSentences] = useState(['The dog is ', 'dash', 'at the stranger']);
    const [selectedWord, setSelectedWord] = useState('');

    const handleWord = (word, removeWord) => {
        if (removeWord) {
            setWords([...words, word]);
            setSelectedWord('');
        } else {
            let wordsArr = [...words];
            if (type !== 'audio') {
                let index = wordsArr?.findIndex((elem) => elem == word);
                wordsArr?.splice(index, 1);
            }

            if (selectedWord && type !== 'audio') {
                wordsArr.push(selectedWord);
            }

            setWords(wordsArr);
            setSelectedWord(word);
        }
    };

    const audioRef = createRef(null);
    const [duration, setDuration] = useState(0);
    const [isReady, setIsReady] = React.useState(false);

    const [isPlaying, setIsPlaying] = React.useState(false);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            audioRef.current?.play();
            setIsPlaying(true);
        }
    };

    const [currrentProgress, setCurrrentProgress] = React.useState(0);
    const progressBarWidth = isNaN(currrentProgress / duration) ? 0 : currrentProgress / duration;

    return (
        <MainLayout level={1}>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '60px', letterSpacing: '5px' }}>
                {type == 'audio' ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                        {/* <ReactAudioPlayer src={v11} controls /> */}

                        <audio
                            ref={audioRef}
                            preload="metadata"
                            onDurationChange={(e) => setDuration(e.currentTarget.duration)}
                            onCanPlay={(e) => {
                                setIsReady(true);
                            }}
                            onPlaying={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onTimeUpdate={(e) => {
                                setCurrrentProgress(e.currentTarget.currentTime);
                            }}
                        >
                            <source type="audio/mp3" src={v11} />
                        </audio>

                        <Box position="relative" sx={{ width: '403px' }}>
                            <AudioPlayerSvg />
                            <Box position="absolute" sx={{ cursor: 'pointer', top: '13px', left: '96px' }}>
                                <AudioBarSvg />
                            </Box>
                            <Box position="absolute" sx={{ cursor: 'pointer', top: '13px', left: '96px' }}>
                                <AudioBarColoredSvg width={progressBarWidth * 275} />
                            </Box>
                            <Box
                                position="absolute"
                                sx={{ cursor: 'pointer', top: '15px', left: '25px' }}
                                onClick={() => {
                                    togglePlayPause();
                                }}
                            >
                                {isReady && <>{isPlaying ? <StopAudioButton /> : <PlayAudioButton />}</>}
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    <>
                        {sentences?.map((elem, index) => (
                            <>
                                {elem == 'dash' ? (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            marginLeft: index > 0 && '10px',
                                            minWidth: '120px',
                                            height: '80px',
                                            borderBottom: '3px solid #5F6C92',
                                            position: 'relative',
                                        }}
                                    >
                                        {selectedWord && (
                                            <Box
                                                onClick={() => handleWord(selectedWord, true)}
                                                sx={{
                                                    textAlign: 'center',
                                                    px: '25px',
                                                    py: '12px',
                                                    background: 'transparent',
                                                    m: 1,
                                                    textTransform: 'none',
                                                    borderRadius: '12px',
                                                    border: '1px solid rgba(51, 63, 97, 0.10)',
                                                    background: '#FFF',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: '#333F61',
                                                        fontWeight: 600,
                                                        fontSize: '32px',
                                                        fontFamily: 'Quicksand',
                                                    }}
                                                >
                                                    {selectedWord}
                                                </span>
                                            </Box>
                                        )}
                                    </Box>
                                ) : (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            marginLeft: index > 0 && '10px',
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            component="h4"
                                            sx={{
                                                mb: 4,
                                                mt: 4,
                                                fontSize: '40px',
                                                color: '#303050',
                                                textAlign: 'center',
                                                fontFamily: 'Quicksand',
                                            }}
                                        >
                                            {elem}
                                        </Typography>
                                    </Box>
                                )}
                            </>
                        ))}
                    </>
                )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '30px' }}>
                {words?.map((elem) => (
                    <Box
                        className={type == 'audio' && selectedWord == elem && 'audioSelectedWord'}
                        onClick={() => handleWord(elem)}
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
                                color: type == 'audio' && selectedWord == elem ? `#58CC02` : '#333F61',
                                fontWeight: 600,
                                fontSize: '32px',
                                fontFamily: 'Quicksand',
                            }}
                        >
                            {elem}
                        </span>
                    </Box>
                ))}
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: '22px',
                    cursor: selectedWord ? 'pointer' : 'not-allowed',
                }}
            >
                <SubmitButton opacity={selectedWord ? 1 : 0.3} />
            </Box>
        </MainLayout>
    );
};

export default Mechanics2;
