import { Bottom, Container, Top } from './styles.js';
import youtube from '../../assets/youtube.svg';
import vocabulary from '../../assets/vocabulary.svg';
import discord from '../../assets/discord.svg';
import anki from '../../assets/anki.svg';
import podcast from '../../assets/podcast.svg';
import movie from '../../assets/movie.svg';
import bookImg from '../../assets/book.svg';
import iso6391 from 'iso-639-1';
import { MdDelete } from "react-icons/md";

export function JourneyCard({ icon, title, date, time, describe, words, tl, onClick, book, ...rest }) {
    let cardIcon;

    const languageName = iso6391.getName(tl);

    if (icon === 'Vocabulary') {
        cardIcon = vocabulary;
    } else if (icon == 'Talk') {
        cardIcon = discord;
    } else if (icon == 'Medias' || icon == 'Video') {
        cardIcon = youtube;
        title = 'Youtube';
    } else if (icon == 'Anki') {
        cardIcon = anki;
    } else if (icon == 'Movie') {
        cardIcon = movie
    } else if (icon == 'Podcast') {
        cardIcon = podcast
    } else {
        cardIcon = bookImg
        title = book
    }

    return (
        <Container>
            <Top>
                <div>
                    <img src={cardIcon} alt={title} />
                    <h5>{title}</h5>
                </div>
                <span>{date}</span>
            </Top>
            <Bottom>
                <h6>{describe}</h6>
                {languageName && <h6>{languageName}</h6>}
                {Object.entries(rest).map(([key, value]) => (
                    value && <h6 key={key}>{`${value}`}</h6>
                ))}
                <div>
                    <p>{time}</p>
                    {words == 0 && <p>Words weren't available</p>}
                    {words > 0 && <p>Words {words}</p>}
                    <MdDelete style={{ cursor: 'pointer', fill: '#F03C3C' }} onClick={onClick} fontSize={32} />
                </div>
            </Bottom>
        </Container>
    );
}

