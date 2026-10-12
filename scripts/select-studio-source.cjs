// Repository identity survives renames and cannot resolve to the old archive.
module.exports = async function selectStudioSource({ github, core }) {
  const { data: repository } = await github.request('GET /repositories/{repository_id}', {
    repository_id: 1401250166,
  });
  const { data } = await github.rest.actions.listWorkflowRuns({
    owner: repository.owner.login,
    repo: repository.name,
    workflow_id: 'checks.yml',
    branch: 'main',
    event: 'push',
    status: 'success',
    per_page: 1,
  });
  const run = data.workflow_runs[0];
  if (!run || run.head_repository?.id !== repository.id || !/^[a-f0-9]{40}$/.test(run.head_sha)) {
    throw new Error('No successful Design Studio main push is available to publish.');
  }
  core.setOutput('repository', repository.full_name);
  core.setOutput('sha', run.head_sha);
  core.info(`Building Design Studio from ${repository.full_name}@${run.head_sha} (checks ${run.html_url}).`);
};
