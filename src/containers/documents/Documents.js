import React from "react";
import Header from "../../components/header/Header";
import {Tab, Nav, Form, Row, Button} from "react-bootstrap";
import {Link} from "react-router-dom";

export default function Documents() {
  return (
    <main className="page-content documents-page">
      <Header title="Modify Orders" />

      <div className="main-content">
        <Tab.Container id="document-tabs" defaultActiveKey="contracts">
          <div className="custom-tab-wrap">
            <Nav variant="pills">
              <Nav.Item>
                <Nav.Link eventKey="contracts">Contracts</Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="deliveryNote">Delivery Note</Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="analysis">Analysis </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="invoice">Invoice</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <Tab.Content>
            <Tab.Pane eventKey="contracts">
              <div className="form-wrapp mt-0">
                <Form action="">
                  <Row>
                    <div className="col-12">
                      <Form.Group>
                        <Form.Label className="dropzon-label">Buyer Contract</Form.Label>
                        <div className="upload-wrap">
                          <div className="uploaded-doc">
                            <div className="doctype-icon">
                              <img src="/assets/images/icons/pdf.png" alt="PDF" />
                            </div>
                            <div>
                              <h5>Buyer Contract.pdf</h5>
                              <h6 className="gray">2.3 MB</h6>
                            </div>
                          </div>
                          <div className="delete-upload">
                            <i className="ri-delete-bin-line"></i>
                          </div>
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-12">
                      <Form.Group>
                        <Form.Label className="dropzon-label">Seller Contract</Form.Label>
                        <div className="upload-wrap">
                          <div className="uploaded-doc">
                            <div className="doctype-icon">
                              <img src="/assets/images/icons/pdf.png" alt="PDF" className="img-contain" />
                            </div>
                            <div>
                              <h5>Seller Contract.pdf</h5>
                              <h6 className="gray">2.3 MB</h6>
                            </div>
                          </div>
                          <div className="delete-upload">
                            <i className="ri-delete-bin-line"></i>
                          </div>
                        </div>
                      </Form.Group>
                    </div>
                  </Row>
                  <Button variant="none" className="primary-btn" type="submit">
                    Save
                  </Button>
                  <Link to="#" className="btn secondary-btn">
                    Cancel
                  </Link>
                </Form>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="deliveryNote">
              <h3>No Documents Here</h3>
            </Tab.Pane>
            <Tab.Pane eventKey="analysis">
              <h3>No Documents Here</h3>
            </Tab.Pane>
            <Tab.Pane eventKey="invoice">
              <h3>No Documents Here</h3>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </main>
  );
}
