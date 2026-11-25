(async()=>{
  const requiredRole=document.body.dataset.requiredRole;
  const welcome=document.getElementById("welcomeMessage");
  const {data:{session},error:sessionError}=await supabaseClient.auth.getSession();
  if(sessionError||!session){location.replace("../login.html");return;}
  const {data:profile,error}=await supabaseClient.from("profiles").select("full_name,email,role").eq("id",session.user.id).single();
  if(error||!profile||profile.role!==requiredRole){await supabaseClient.auth.signOut();location.replace("../login.html");return;}
  document.getElementById("userEmail").textContent=profile.email||session.user.email;
  welcome.textContent=`Welcome${profile.full_name?", "+profile.full_name:""}. You are signed in with the ${profile.role} account.`;
  document.getElementById("logoutButton").addEventListener("click",async()=>{await supabaseClient.auth.signOut();location.replace("../login.html");});
})();
