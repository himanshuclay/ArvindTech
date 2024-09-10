import { Card, Col, Row } from 'react-bootstrap'
import EasyEdit from 'react-easy-edit';
import Types from 'react-easy-edit';

// Component
import { PageBreadcrumb } from '@/components'

const XEditable = () => {
	const save = (value: string) => {}
	const cancel = () => {}

	return (
		<>
			<PageBreadcrumb title="Editable" subName="Forms" />
			<Row>
				<Col xs={12}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Inline Examples</h4>
							<table className="table table-bordered table-striped mb-0">
								<tbody>
									<tr>
										<td style={{ width: '35%' }}>Simple text field</td>
										<td style={{ width: '65%' }}>
											<EasyEdit
												value={'superuser'}
												placeholder="superuser"
												type={Types.TEXT}
												onSave={save}
												onCancel={cancel}
												saveButtonLabel={
													<button
														type="submit"
														className="btn btn-primary editable-submit btn-sm waves-effect waves-light"
													>
														<i className="mdi mdi-check"></i>
													</button>
												}
												cancelButtonLabel={
													<button
														type="button"
														className="btn btn-danger editable-cancel btn-sm waves-effect"
													>
														<i className="mdi mdi-close"></i>
													</button>
												}
												attributes={{ name: 'superuser', id: 1 }}
											/>
										</td>
									</tr>

									<tr>
										<td>Empty text field, required</td>
										<td>
											<EasyEdit
												placeholder="Empty"
												type={Types.TEXT}
												onSave={save}
												onCancel={cancel}
												saveButtonLabel={
													<button
														type="submit"
														className="btn btn-primary editable-submit btn-sm waves-effect waves-light"
													>
														<i className="mdi mdi-check"></i>
													</button>
												}
												cancelButtonLabel={
													<button
														type="button"
														className="btn btn-danger editable-cancel btn-sm waves-effect"
													>
														<i className="mdi mdi-close"></i>
													</button>
												}
												attributes={{ name: '', id: 1 }}
											/>
										</td>
									</tr>
									<tr>
										<td>Select, local array, custom display</td>
										<td>
											<EasyEdit
												type={Types.DATALIST}
												options={[
													{ label: 'not selected', value: '' },
													{ label: 'Male', value: 'Male' },
													{ label: 'female', value: 'female' },
												]}
												onSave={save}
												onCancel={cancel}
												placeholder="not selected"
												saveButtonLabel={
													<button
														type="submit"
														className="btn btn-primary editable-submit btn-sm waves-effect waves-light"
													>
														<i className="mdi mdi-check"></i>
													</button>
												}
												cancelButtonLabel={
													<button
														type="button"
														className="btn btn-danger editable-cancel btn-sm waves-effect"
													>
														<i className="mdi mdi-close"></i>
													</button>
												}
											/>
										</td>
									</tr>
									<tr>
										<td>Select, remote array, no buttons</td>
										<td>
											<EasyEdit
												type={Types.SELECT}
												options={[]}
												onSave={save}
												onCancel={cancel}
												value="Admin"
												saveButtonLabel={
													<button
														type="submit"
														className="btn btn-primary editable-submit btn-sm waves-effect waves-light"
													>
														<i className="mdi mdi-check"></i>
													</button>
												}
												cancelButtonLabel={
													<button
														type="button"
														className="btn btn-danger editable-cancel btn-sm waves-effect"
													>
														<i className="mdi mdi-close"></i>
													</button>
												}
												instructions="Error when loading list"
											/>
										</td>
									</tr>
									<tr>
										<td>Select, error while loading</td>
										<td>
											<EasyEdit
												type={Types.SELECT}
												options={[]}
												onSave={save}
												onCancel={cancel}
												value="Active"
												saveButtonLabel={
													<button
														type="submit"
														className="btn btn-primary editable-submit btn-sm waves-effect waves-light"
													>
														<i className="mdi mdi-check"></i>
													</button>
												}
												cancelButtonLabel={
													<button
														type="button"
														className="btn btn-danger editable-cancel btn-sm waves-effect"
													>
														<i className="mdi mdi-close"></i>
													</button>
												}
												instructions="Error when loading list"
											/>
										</td>
									</tr>
									<tr>
										<td>Combodate (date)</td>
										<td>
											<EasyEdit
												type={Types.DATE}
												placeholder={new Date()
													.toISOString()
													.substr(0, 11)
													.replace('T', ' ')}
												onSave={save}
												onCancel={cancel}
												instructions="Select your date of birth"
												saveButtonLabel={
													<button
														type="submit"
														className="btn btn-primary editable-submit btn-sm waves-effect waves-light"
													>
														<i className="mdi mdi-check"></i>
													</button>
												}
												cancelButtonLabel={
													<button
														type="button"
														className="btn btn-danger editable-cancel btn-sm waves-effect"
													>
														<i className="mdi mdi-close"></i>
													</button>
												}
											/>
										</td>
									</tr>
									<tr>
										<td>Combodate (datetime)</td>
										<td>
											<EasyEdit
												type={Types.DATETIME_LOCAL}
												placeholder="Empty"
												onSave={save}
												onCancel={cancel}
												saveButtonLabel={
													<button
														type="submit"
														className="btn btn-primary editable-submit btn-sm waves-effect waves-light"
													>
														<i className="mdi mdi-check"></i>
													</button>
												}
												cancelButtonLabel={
													<button
														type="button"
														className="btn btn-danger editable-cancel btn-sm waves-effect"
													>
														<i className="mdi mdi-close"></i>
													</button>
												}
											/>
										</td>
									</tr>
									<tr>
										<td>
											Textarea, buttons below. Submit by <i>ctrl+enter</i>
										</td>
										<td>
											<EasyEdit
												type={Types.TEXTAREA}
												onSave={save}
												onCancel={cancel}
												placeholder="awesome user!"
												saveButtonLabel={
													<button
														type="submit"
														className="btn btn-primary editable-submit btn-sm waves-effect waves-light "
													>
														<i className="mdi mdi-check"></i>
													</button>
												}
												cancelButtonLabel={
													<button
														type="button"
														className="btn btn-danger editable-cancel btn-sm waves-effect"
													>
														<i className="mdi mdi-close"></i>
													</button>
												}
											/>
										</td>
									</tr>
									<tr>
										<td>Checklist</td>
										<td>
											<EasyEdit
												type={Types.CHECKBOX}
												options={[
													{ label: 'Banana', value: 'Banana' },
													{ label: 'Peach', value: 'Peach' },
													{ label: 'Apple', value: 'Apple' },
													{ label: 'Watermelon', value: 'Watermelon' },
													{ label: 'Orange', value: 'Orange' },
												]}
												onSave={save}
												onCancel={cancel}
												value={['Banana', 'Peach']}
												saveButtonLabel={
													<button
														type="submit"
														className="btn btn-primary editable-submit btn-sm waves-effect waves-light"
													>
														<i className="mdi mdi-check"></i>
													</button>
												}
												cancelButtonLabel={
													<button
														type="button"
														className="btn btn-danger editable-cancel btn-sm waves-effect"
													>
														<i className="mdi mdi-close"></i>
													</button>
												}
											/>
										</td>
									</tr>
								</tbody>
							</table>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default XEditable
