import { Col, Container, Row } from 'react-bootstrap'

const WraperLayout = ({ children, className }) => {
    return (
        <section className={className}>
            <Container>
                <Row>
                    <Col lg={12}>
                        {children}
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default WraperLayout;
