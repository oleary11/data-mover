from  google.cloud.billing import budgets_v1beta1
from google.oauth2 import service_account
import pathlib

# path to parent and src directory
parent_dir = pathlib.Path(__file__).parent.resolve()
src_dir = pathlib.Path(__file__).parent.parent.resolve()

def get_spot_vm_pricing(project_id, credentials_path):
    billing_account_id = "014AA9-6EB027-662EE1"

    credentials = service_account.Credentials.from_service_account_file(credentials_path)
    client = budgets_v1beta1.BudgetServiceClient(credentials=credentials)
    parent = f"billingAccounts/{billing_account_id}"

    request = budgets_v1beta1.ListBudgetsRequest(parent=parent)

    budgets = client.list_budgets(request)
    for budget in budgets:
        if budget.display_name == "Spot VM":
            amount = budget.amount
            currency = budget.currency_code
            return f"{amount} {currency}"

if __name__ == '__main__':
    project_id = 'my-project-id'
    credentials_path = '{0}/cred.json'.format(parent_dir)

    spot_vm_pricing = get_spot_vm_pricing(project_id, credentials_path)
    print(f"The current spot VM pricing is: {spot_vm_pricing}")

