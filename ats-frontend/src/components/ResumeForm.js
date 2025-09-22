import React from 'react';
import InputField from './InputField';
import ArrayField from './ArrayField';
import SectionHeader from './SectionHeader';
import './ResumeForm.css'; 
function ResumeForm({
    resumeData,
    handleInputChange,
    handleAddItem,
    handleRemoveItem,
    handleArrayFieldChange,
    formSteps,
    currentStep,
    onNextStep,
    onPrevStep,
    onGoToStep
}) {
    const currentSectionId = formSteps[currentStep].id;
    const currentSectionLabel = formSteps[currentStep].label;

    return (
        <div className="resume-form-container">
            <div className="form-navigation-tabs">
                {formSteps.map((step, index) => (
                    <div
                        key={step.id}
                        className={`nav-tab ${index === currentStep ? 'active' : ''}`}
                        onClick={() => onGoToStep(index)}
                    >
                        {step.label}
                    </div>
                ))}
            </div>

            <div className="form-section-content">
                <SectionHeader title={currentSectionLabel} />

                {currentSectionId === 'contact' && (
                    <div className="form-grid">
                        <InputField label="Full Name" value={resumeData.contact.fullName} onChange={(e) => handleInputChange('contact', 'fullName', e.target.value)} />
                        <InputField label="Job Title" value={resumeData.contact.jobTitle} onChange={(e) => handleInputChange('contact', 'jobTitle', e.target.value)} />
                        <InputField label="Email" type="email" value={resumeData.contact.email} onChange={(e) => handleInputChange('contact', 'email', e.target.value)} />
                        <InputField label="Phone" type="tel" value={resumeData.contact.phone} onChange={(e) => handleInputChange('contact', 'phone', e.target.value)} />
                        <InputField label="Address" value={resumeData.contact.address} onChange={(e) => handleInputChange('contact', 'address', e.target.value)} />
                        <InputField label="LinkedIn" value={resumeData.contact.linkedin} onChange={(e) => handleInputChange('contact', 'linkedin', e.target.value)} />
                        <InputField label="Github" value={resumeData.contact.github} onChange={(e) => handleInputChange('contact', 'github', e.target.value)} />
                        <InputField label="Twitter" value={resumeData.contact.twitter} onChange={(e) => handleInputChange('contact', 'twitter', e.target.value)} />
                        <InputField label="Portfolio" value={resumeData.contact.portfolio} onChange={(e) => handleInputChange('contact', 'portfolio', e.target.value)} />
                        <InputField label="Blogs (Optional)" value={resumeData.contact.blogs} onChange={(e) => handleInputChange('contact', 'blogs', e.target.value)} />
                    </div>
                )}

                {currentSectionId === 'summary' && (
                    <div className="form-single-field">
                        <label>Summary/About Me</label>
                        <textarea value={resumeData.summary} onChange={(e) => handleInputChange('summary', null, e.target.value)} rows="6"></textarea>
                    </div>
                )}

                {currentSectionId === 'education' && (
                    <ArrayField
                        items={resumeData.education}
                        sectionName="education"
                        defaultItem={{ degree: '', university: '', year: '' }}
                        onAddItem={handleAddItem}
                        onRemoveItem={handleRemoveItem}
                        renderItem={({ item, index }) => (
                            <div className="form-item-group">
                                <InputField label="Degree/Major" value={item.degree} onChange={(e) => handleInputChange('education', 'degree', e.target.value, index)} />
                                <InputField label="University/School" value={item.university} onChange={(e) => handleInputChange('education', 'university', e.target.value, index)} />
                                <InputField label="Year" value={item.year} onChange={(e) => handleInputChange('education', 'year', e.target.value, index)} />
                            </div>
                        )}
                    />
                )}

                {currentSectionId === 'experience' && (
                    <ArrayField
                        items={resumeData.experience}
                        sectionName="experience"
                        defaultItem={{ title: '', company: '', duration: '', responsibilities: [''] }}
                        onAddItem={handleAddItem}
                        onRemoveItem={handleRemoveItem}
                        renderItem={({ item, index }) => (
                            <div className="form-item-group">
                                <InputField label="Job Title" value={item.title} onChange={(e) => handleInputChange('experience', 'title', e.target.value, index)} />
                                <InputField label="Company" value={item.company} onChange={(e) => handleInputChange('experience', 'company', e.target.value, index)} />
                                <InputField label="Duration" value={item.duration} onChange={(e) => handleInputChange('experience', 'duration', e.target.value, index)} />
                                <ArrayField
                                    items={item.responsibilities}
                                    sectionName={`responsibilities-${index}`} // Unique key for nested array
                                    defaultItem={''}
                                    onAddItem={() => {
                                        const newResps = [...item.responsibilities, ''];
                                        handleInputChange('experience', 'responsibilities', newResps, index);
                                    }}
                                    onRemoveItem={(respIndex) => {
                                        const newResps = item.responsibilities.filter((_, i) => i !== respIndex);
                                        handleInputChange('experience', 'responsibilities', newResps, index);
                                    }}
                                    renderItem={({ item: respItem, index: respIndex }) => (
                                        <InputField
                                            label={`Responsibility ${respIndex + 1}`}
                                            value={respItem}
                                            onChange={(e) => {
                                                const newResps = [...item.responsibilities];
                                                newResps[respIndex] = e.target.value;
                                                handleInputChange('experience', 'responsibilities', newResps, index);
                                            }}
                                        />
                                    )}
                                    // Pass additional props for styling nested items
                                    isNested={true}
                                />
                            </div>
                        )}
                    />
                )}

                {currentSectionId === 'projects' && (
                    <ArrayField
                        items={resumeData.projects}
                        sectionName="projects"
                        defaultItem={{ title: '', link: '', techStack: '', description: '' }}
                        onAddItem={handleAddItem}
                        onRemoveItem={handleRemoveItem}
                        renderItem={({ item, index }) => (
                            <div className="form-item-group">
                                <InputField label="Project Title" value={item.title} onChange={(e) => handleInputChange('projects', 'title', e.target.value, index)} />
                                <InputField label="Link (URL)" value={item.link} onChange={(e) => handleInputChange('projects', 'link', e.target.value, index)} />
                                <InputField label="Tech Stack (comma-separated)" value={item.techStack} onChange={(e) => handleInputChange('projects', 'techStack', e.target.value, index)} />
                                <InputField label="Description" isTextArea={true} value={item.description} onChange={(e) => handleInputChange('projects', 'description', e.target.value, index)} />
                            </div>
                        )}
                    />
                )}

                {currentSectionId === 'skills' && (
                    <>
                        <ArrayField
                            items={resumeData.skills.technical}
                            sectionName="technicalSkills"
                            defaultItem={''}
                            onAddItem={() => handleAddItem('skills', { technical: [...resumeData.skills.technical, ''], soft: resumeData.skills.soft })}
                            onRemoveItem={(index) => {
                                const newSkills = resumeData.skills.technical.filter((_, i) => i !== index);
                                handleInputChange('skills', 'technical', newSkills, null); // Pass null for index to update direct object
                            }}
                            renderItem={({ item, index }) => (
                                <InputField label={`Technical Skill ${index + 1}`} value={item} onChange={(e) => {
                                    const newSkills = [...resumeData.skills.technical];
                                    newSkills[index] = e.target.value;
                                    handleInputChange('skills', 'technical', newSkills, null);
                                }} />
                            )}
                            title="Technical Skills"
                        />
                        <ArrayField
                            items={resumeData.skills.soft}
                            sectionName="softSkills"
                            defaultItem={''}
                            onAddItem={() => handleAddItem('skills', { technical: resumeData.skills.technical, soft: [...resumeData.skills.soft, ''] })}
                            onRemoveItem={(index) => {
                                const newSkills = resumeData.skills.soft.filter((_, i) => i !== index);
                                handleInputChange('skills', 'soft', newSkills, null);
                            }}
                            renderItem={({ item, index }) => (
                                <InputField label={`Soft Skill ${index + 1}`} value={item} onChange={(e) => {
                                    const newSkills = [...resumeData.skills.soft];
                                    newSkills[index] = e.target.value;
                                    handleInputChange('skills', 'soft', newSkills, null);
                                }} />
                            )}
                            title="Soft Skills"
                        />
                    </>
                )}

                {currentSectionId === 'certificates' && (
                    <ArrayField
                        items={resumeData.certificates}
                        sectionName="certificates"
                        defaultItem={{ name: '', issuer: '', date: '' }}
                        onAddItem={handleAddItem}
                        onRemoveItem={handleRemoveItem}
                        renderItem={({ item, index }) => (
                            <div className="form-item-group">
                                <InputField label="Certificate Name" value={item.name} onChange={(e) => handleInputChange('certificates', 'name', e.target.value, index)} />
                                <InputField label="Issuer" value={item.issuer} onChange={(e) => handleInputChange('certificates', 'issuer', e.target.value, index)} />
                                <InputField label="Date (e.g., 2023)" value={item.date} onChange={(e) => handleInputChange('certificates', 'date', e.target.value, index)} />
                            </div>
                        )}
                    />
                )}

                {currentSectionId === 'languages' && (
                    <ArrayField
                        items={resumeData.languages}
                        sectionName="languages"
                        defaultItem={{ name: '', proficiency: '' }}
                        onAddItem={handleAddItem}
                        onRemoveItem={handleRemoveItem}
                        renderItem={({ item, index }) => (
                            <div className="form-item-group">
                                <InputField label="Language" value={item.name} onChange={(e) => handleInputChange('languages', 'name', e.target.value, index)} />
                                <InputField label="Proficiency" value={item.proficiency} onChange={(e) => handleInputChange('languages', 'proficiency', e.target.value, index)} />
                            </div>
                        )}
                    />
                )}
            </div>

            <div className="form-controls">
                {currentStep > 0 && <button onClick={onPrevStep}>Previous</button>}
                {currentStep < formSteps.length - 1 && <button onClick={onNextStep}>Next</button>}
                {currentStep === formSteps.length - 1 && <button onClick={() => alert('Resume data prepared for download!')}>Finish & Download</button>}
            </div>
        </div>
    );
}

export default ResumeForm;s