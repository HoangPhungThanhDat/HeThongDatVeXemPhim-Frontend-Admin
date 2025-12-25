import React from "react";

const Register = () => {
  return (
    <div className="login-page">
      <div className="login-header box-shadow">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="brand-logo">
            <a href="login.html">
              <img src="vendors/images/deskapp-logo.svg" alt="" />
            </a>
          </div>
          <div className="login-menu">
            <ul>
              <li>
                <a href="login.html">Login</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="register-page-wrap d-flex align-items-center flex-wrap justify-content-center">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 col-lg-7">
              <img src="vendors/images/register-page-img.png" alt="" />
            </div>
            <div className="col-md-6 col-lg-5">
              <div className="register-box bg-white box-shadow border-radius-10">
                <div className="wizard-content">
                  <form className="tab-wizard2 wizard-circle wizard">
                    {/* Step 1 */}
                    <h5>Basic Account Credentials</h5>
                    <section>
                      <div className="form-wrap max-width-600 mx-auto">
                        <div className="form-group row">
                          <label className="col-sm-4 col-form-label">Email Address*</label>
                          <div className="col-sm-8">
                            <input type="email" className="form-control" />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-4 col-form-label">Username*</label>
                          <div className="col-sm-8">
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-4 col-form-label">Password*</label>
                          <div className="col-sm-8">
                            <input type="password" className="form-control" />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-4 col-form-label">Confirm Password*</label>
                          <div className="col-sm-8">
                            <input type="password" className="form-control" />
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Step 2 */}
                    <h5>Personal Information</h5>
                    <section>
                      <div className="form-wrap max-width-600 mx-auto">
                        <div className="form-group row">
                          <label className="col-sm-4 col-form-label">Full Name*</label>
                          <div className="col-sm-8">
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="form-group row align-items-center">
                          <label className="col-sm-4 col-form-label">Gender*</label>
                          <div className="col-sm-8">
                            <div className="custom-control custom-radio custom-control-inline pb-0">
                              <input type="radio" id="male" name="gender" className="custom-control-input" />
                              <label className="custom-control-label" htmlFor="male">Male</label>
                            </div>
                            <div className="custom-control custom-radio custom-control-inline pb-0">
                              <input type="radio" id="female" name="gender" className="custom-control-input" />
                              <label className="custom-control-label" htmlFor="female">Female</label>
                            </div>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-4 col-form-label">City</label>
                          <div className="col-sm-8">
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-4 col-form-label">State</label>
                          <div className="col-sm-8">
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Step 3 */}
                    <h5>Payment Method & Info</h5>
                    <section>
                      <div className="form-wrap max-width-600 mx-auto">
                        <div className="form-group row">
                          <label className="col-sm-4 col-form-label">Credit Card Type</label>
                          <div className="col-sm-8">
                            <select className="form-control selectpicker" title="Select Card Type">
                              <option value="1">Option 1</option>
                              <option value="2">Option 2</option>
                              <option value="3">Option 3</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-group row align-items-center">
                          <label className="col-sm-4 col-form-label">Credit Card Number</label>
                          <div className="col-sm-8">
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-4 col-form-label">CVC</label>
                          <div className="col-sm-3">
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-4 col-form-label">Expiration Date</label>
                          <div className="col-sm-8">
                            <div className="row">
                              <div className="col-6">
                                <select className="form-control selectpicker" title="Month" data-size="5">
                                  <option value="01">January</option>
                                  <option value="02">February</option>
                                  <option value="03">March</option>
                                  <option value="04">April</option>
                                  <option value="05">May</option>
                                  <option value="06">June</option>
                                  <option value="07">July</option>
                                  <option value="08">August</option>
                                  <option value="09">September</option>
                                  <option value="10">October</option>
                                  <option value="11">November</option>
                                  <option value="12">December</option>
                                </select>
                              </div>
                              <div className="col-6">
                                <select className="form-control selectpicker" title="Year" data-size="5">
                                  <option>2020</option>
                                  <option>2019</option>
                                  <option>2018</option>
                                  <option>2017</option>
                                  <option>2016</option>
                                  <option>2015</option>
                                  <option>2014</option>
                                  <option>2013</option>
                                  <option>2012</option>
                                  <option>2011</option>
                                  <option>2010</option>
                                  <option>2009</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Step 4 */}
                    <h5>Overview Information</h5>
                    <section>
                      <div className="form-wrap max-width-600 mx-auto">
                        <ul className="register-info">
                          <li>
                            <div className="row">
                              <div className="col-sm-4 weight-600">Email Address</div>
                              <div className="col-sm-8">example@abc.com</div>
                            </div>
                          </li>
                          <li>
                            <div className="row">
                              <div className="col-sm-4 weight-600">Username</div>
                              <div className="col-sm-8">Example</div>
                            </div>
                          </li>
                          <li>
                            <div className="row">
                              <div className="col-sm-4 weight-600">Password</div>
                              <div className="col-sm-8">.....000</div>
                            </div>
                          </li>
                          <li>
                            <div className="row">
                              <div className="col-sm-4 weight-600">Full Name</div>
                              <div className="col-sm-8">john smith</div>
                            </div>
                          </li>
                          <li>
                            <div className="row">
                              <div className="col-sm-4 weight-600">Location</div>
                              <div className="col-sm-8">123 Example</div>
                            </div>
                          </li>
                        </ul>
                        <div className="custom-control custom-checkbox mt-4">
                          <input type="checkbox" className="custom-control-input" id="customCheck1" />
                          <label className="custom-control-label" htmlFor="customCheck1">
                            I have read and agreed to the terms of services and privacy policy
                          </label>
                        </div>
                      </div>
                    </section>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <button
        type="button"
        id="success-modal-btn"
        hidden
        data-toggle="modal"
        data-target="#success-modal"
        data-backdrop="static"
      >
        Launch modal
      </button>
      <div
        className="modal fade"
        id="success-modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered max-width-400" role="document">
          <div className="modal-content">
            <div className="modal-body text-center font-18">
              <h3 className="mb-20">Form Submitted!</h3>
              <div className="mb-30 text-center">
                <img src="vendors/images/success.png" alt="" />
              </div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            </div>
            <div className="modal-footer justify-content-center">
              <a href="login.html" className="btn btn-primary">
                Done
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
