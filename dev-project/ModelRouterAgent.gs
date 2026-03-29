// =============================================================================
// ModelRouterAgent.gs — Multi-AI Routing Agent
// Project: nexus-command
// Account: cary.hebert@gmail.com
// Updated: 2026-03-29
// =============================================================================
// Routes incoming tasks to the correct AI model based on task_type.
// All API keys are read from Script Properties — never hardcoded.
//
// ROUTING TABLE:
//   Claude      → complex_code, architecture, writing, thesis, long_form, debugging
//   ChatGPT     → quick_script, prototype, web_task, multimedia
//   Gemini      → mandarin, ocr, translation, chinese
//   Perplexity  → research, current_events, sourced
// =============================================================================

function routeToModel(payload) {
  var taskType = (payload.task_type || '').toLowerCase().trim();
  var prompt = payload.prompt || '';

  if (!taskType || !prompt) {
    return buildResponse(400, 'Missing required fields: task_type, prompt');
  }

  var claudeTasks = ['complex_code', 'architecture', 'writing', 'thesis', 'long_form', 'debugging'];
  var chatgptTasks = ['quick_script', 'prototype', 'web_task', 'multimedia'];
  var geminiTasks = ['mandarin', 'ocr', 'translation', 'chinese'];
  var perplexityTasks = ['research', 'current_events', 'sourced'];

  if (claudeTasks.indexOf(taskType) !== -1) return _callClaude(prompt, payload.context);
  if (chatgptTasks.indexOf(taskType) !== -1) return _callChatGPT(prompt, payload.context);
  if (geminiTasks.indexOf(taskType) !== -1) return _callGemini(prompt, payload.context);
  if (perplexityTasks.indexOf(taskType) !== -1) return _callPerplexity(prompt, payload.context);

  return buildResponse(400, 'Unknown task_type: ' + taskType);
}


function _callClaude(prompt, context) {
  var apiKey = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  if (!apiKey) return buildResponse(500, 'Missing Script Property: ANTHROPIC_API_KEY');

  var body = {
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: context ? 'Context:\n' + context + '\n\nTask:\n' + prompt : prompt }]
  };

  try {
    var response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(body),
      muteHttpExceptions: true
    });
    var raw = response.getContentText();
    var result = JSON.parse(raw);
    var text = (result.content && result.content[0]) ? result.content[0].text : '';
    return buildResponse(200, 'Claude response received', { model: 'claude', output: text || 'EMPTY raw: ' + raw.substring(0, 400) });
  } catch (e) {
    return buildResponse(500, 'Claude API error: ' + e.message);
  }
}


function _callChatGPT(prompt, context) {
  var apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  if (!apiKey) return buildResponse(500, 'Missing Script Property: OPENAI_API_KEY');

  var body = {
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: context ? 'Context:\n' + context + '\n\nTask:\n' + prompt : prompt }
    ],
    max_tokens: 2048
  };

  try {
    var response = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(body),
      muteHttpExceptions: true
    });
    var raw = response.getContentText();
    var result = JSON.parse(raw);
    var text = (result.choices && result.choices[0] && result.choices[0].message) ? result.choices[0].message.content : '';
    return buildResponse(200, 'ChatGPT response received', { model: 'chatgpt', output: text || 'EMPTY raw: ' + raw.substring(0, 400) });
  } catch (e) {
    return buildResponse(500, 'ChatGPT API error: ' + e.message);
  }
}


function _callGemini(prompt, context) {
  var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) return buildResponse(500, 'Missing Script Property: GEMINI_API_KEY');

  var fullPrompt = context ? 'Context:\n' + context + '\n\nTask:\n' + prompt : prompt;
  var body = { contents: [{ parts: [{ text: fullPrompt }] }] };
  var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=' + apiKey;

  try {
    var response = UrlFetchApp.fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      payload: JSON.stringify(body),
      muteHttpExceptions: true
    });
    var raw = response.getContentText();
    var result = JSON.parse(raw);
    var text = (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts[0]) ? result.candidates[0].content.parts[0].text : '';
    return buildResponse(200, 'Gemini response received', { model: 'gemini', output: text || 'EMPTY raw: ' + raw.substring(0, 400) });
  } catch (e) {
    return buildResponse(500, 'Gemini API error: ' + e.message);
  }
}


function _callPerplexity(prompt, context) {
  var apiKey = PropertiesService.getScriptProperties().getProperty('PERPLEXITY_API_KEY');
  if (!apiKey) return buildResponse(500, 'Missing Script Property: PERPLEXITY_API_KEY');

  var body = {
    model: 'sonar',
    messages: [
      { role: 'system', content: 'Be precise and cite sources.' },
      { role: 'user', content: context ? 'Context:\n' + context + '\n\nResearch:\n' + prompt : prompt }
    ]
  };

  try {
    var response = UrlFetchApp.fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(body),
      muteHttpExceptions: true
    });
    var raw = response.getContentText();
    var result = JSON.parse(raw);
    var text = (result.choices && result.choices[0] && result.choices[0].message) ? result.choices[0].message.content : '';
    if (!text) return buildResponse(500, 'Perplexity returned empty output', { raw: raw.substring(0, 500) });
    return buildResponse(200, 'Perplexity response received', { model: 'perplexity', output: text });
  } catch (e) {
    return buildResponse(500, 'Perplexity API error: ' + e.message);
  }
}
