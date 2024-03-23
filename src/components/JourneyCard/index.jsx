import { Bottom, Container, Top } from './styles.js';

export function JourneyCard({ icon, title, date, time, describe, words, ...rest }) {
    return (
        <Container>
            <Top>
                <div>
                    <img src={icon} alt={title} />
                    <h5>{title}</h5>
                </div>

                <span>{date}</span>
            </Top>
            <Bottom>
                <h6> {describe} </h6>
                {Object.entries(rest).map(([key, value]) => (
                    <h6 key={key}>{`${value}`}</h6>
                ))}
                <div>
                    <p>{time}</p>
                    {words && <p>Words {words}</p>}
                </div>
            </Bottom>
        </Container>
    );
}
