const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("message");
function showLoginMessage(text, success=false){loginMessage.textContent=text;loginMessage.classList.toggle("success",success)}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button=loginForm.querySelector("button[type=submit]");
  button.disabled=true; showLoginMessage("Signing in…");
  try {
    const {data,error}=await supabaseClient.auth.signInWithPassword({
      email:document.getElementById("email").value.trim(),
      password:document.getElementById("password").value
    });
    if(error) throw error;
    const {data:profile,error:profileError}=await supabaseClient.from("profiles").select("role").eq("id",data.user.id).single();
    if(profileError) throw new Error("Your account profile could not be loaded. Contact the agency administrator.");
    const destinations={admin:"admin/dashboard.html",student:"student/dashboard.html",company:"company/dashboard.html"};
    if(!destinations[profile.role]) throw new Error("This account has an unrecognized role.");
    window.location.replace(destinations[profile.role]);
  } catch(error) { showLoginMessage(error.message || "Unable to sign in."); button.disabled=false; }
});
