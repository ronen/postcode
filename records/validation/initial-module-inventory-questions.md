# Clean-agent instrument questions

You are evaluating a software-understanding view in a clean context. Use only the supplied view artifact. Do not inspect source code, repository documentation, the filesystem outside the supplied artifact/output locations, prior tasks, or the internet. General programming knowledge may inform interpretation, but label interpretation and do not treat documentation assertions as established behavior. This is an instrument-usability exercise, not a code review.

Read the complete supplied view, in chunks if needed. Answer these consistent structured questions using names, handles or Entity IDs from the view as evidence:

1. What does the project appear to contain?
2. What are the apparent roles of up to five modules? Distinguish stated assertions from inference.
3. Which one subject would you investigate next, and what question would you ask of it? Justify the choice from the view.
4. What conclusions are supported, and which consequential conclusions are not established?
5. What ambiguities remain?
6. What information is confusing or disproportionately distracting?
7. What conceptual information is missing for a useful investigation starting point?

Return a JSON object with keys contents, module_roles, next_subject, supported_conclusions, ambiguities, confusing_information, missing_conceptual_information, and usefulness. The last field should give a brief qualitative judgment, not a numeric score. State whether the complete artifact was read and any context or output limits in a conditions field. Do not acquire more information to answer these questions.
