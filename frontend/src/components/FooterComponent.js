import { Container, Row, Col } from 'react-bootstrap';

const FooterComponent = () => {
  return <>{ContainerFluidExample()}</>;
};

function ContainerFluidExample() {
  return (
    <footer>
      <Container fluid>
        <Row className='mt-5'>
          <Col className='bg-dark text-white text-center py-3'>
            Copyright &copy; Amazing online shop
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default FooterComponent;
//export default ContainerFluidExample;
