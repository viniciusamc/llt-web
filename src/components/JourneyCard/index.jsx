import { Bottom, Container, Top } from './styles.js';
import youtube from '../../assets/youtube.svg';
import vocabulary from '../../assets/vocabulary.svg';
import discord from '../../assets/discord.svg';
import anki from '../../assets/anki.svg';
import iso6391 from 'iso-639-1';

export function JourneyCard({ icon, title, date, time, describe, words, tl, ...rest }) {
    let cardIcon;

    const languageName = iso6391.getName(tl);

    if (icon === 'vocabulary') {
        cardIcon = vocabulary;
    } else if (icon === 'talk') {
        cardIcon = discord;
    } else if (icon === 'youtube') {
        cardIcon = youtube;
    } else if (icon === 'anki') {
        cardIcon = anki;
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
                    {words == 0 && <p>Subtitles weren't available</p>}
                    {words > 0 && <p>Words {words}</p>}
                </div>
            </Bottom>
        </Container>
    );
}

